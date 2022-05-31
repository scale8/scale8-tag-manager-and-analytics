import { ObjectId } from 'mongodb';
import User from '../mongo/models/User';
import App from '../mongo/models/tag/App';
import Revision from '../mongo/models/tag/Revision';
import EnvironmentVariable from '../mongo/models/EnvironmentVariable';
import Environment from '../mongo/models/tag/Environment';
import userMessages from '../errors/UserMessages';
import OperationOwner from '../enums/OperationOwner';
import GQLMethod from '../enums/GQLMethod';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import AppPlatformRevision from '../mongo/models/tag/AppPlatformRevision';
import PlatformRevision from '../mongo/models/tag/PlatformRevision';
import Platform from '../mongo/models/tag/Platform';
import Action from '../mongo/models/tag/Action';
import Dependency from '../mongo/models/Dependency';
import IngestEndpointEnvironment from '../mongo/models/data/IngestEndpointEnvironment';
import DataError from '../errors/DataError';
import PlatformAsset from '../mongo/models/tag/PlatformAsset';
import GenericError from '../errors/GenericError';
import { ConfigType } from '../mongo/types/Types';
import { diff } from './DiffUtils';
import Model from '../mongo/abstractions/Model';
import { resolveRevision } from './RevisionUtils';
import { getIngestEndpointInstallDomain } from './IngestEndpointEnvironmentUtils';
import BaseStorage from '../backends/storage/abstractions/BaseStorage';
import { LogPriority } from '../enums/LogPriority';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import { createCname, getCNAME } from './CertificateUtils';

export const isEnvironmentVariableNameValid = (name: string): boolean => {
    return name.match(/^[A-Z_]+$/) !== null;
};

const getConfigFromModels = (models: Model[]): ConfigType => {
    return Array.from(
        new Map(
            models.map((model) => [
                model.id.toString(),
                { ...{ ___type: model.constructor.name }, ...model.toConfig() },
            ]),
        ).entries(),
    ).reduce((_, [k, v]) => ({ ..._, [k]: v }), {});
};

const generateConfig = async (revisionId: ObjectId | Revision): Promise<ConfigType> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    //generate a config to run the core (and other platforms) against...
    const revision = await resolveRevision(revisionId);
    const linkedRevisionModels = (await diff(undefined, revision))
        .map((_) => _.right)
        .filter((_): _ is Model => _ !== null);
    //get all the linked platform revisions and combine this with our revision config.
    const appPlatformRevisions = await repoFactory(AppPlatformRevision).findByIds(
        revision.appPlatformRevisionIds,
    );
    const platformRevisions = await Promise.all(
        appPlatformRevisions.map(
            async (_) =>
                await repoFactory(PlatformRevision).findByIdThrows(
                    _.platformRevisionId,
                    userMessages.revisionFailed,
                ),
        ),
    );
    const linkedPlatformRevisionModels = (
        await Promise.all(
            platformRevisions.map(async (platformRevision) =>
                (await diff(undefined, platformRevision))
                    .map((_) => _.right)
                    .filter((_): _ is Model => _ !== null),
            ),
        )
    ).flat();
    //platforms exist outside of revision containers, but we need a little more info...
    const linkedPlatformModels = await repoFactory(Platform).findByIds(
        platformRevisions.map((_) => _.platformId),
    );
    return {
        ...getConfigFromModels(linkedRevisionModels),
        ...getConfigFromModels(linkedPlatformRevisionModels),
        ...getConfigFromModels(linkedPlatformModels),
    };
};

const getAppUsageIngestEnvironmentId = async (app: App): Promise<string> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    if (app.usageIngestEndpointEnvironmentId === undefined) {
        throw new GenericError(
            `Failed to get usage Ingest Endpoint for App: ${app.id.toString()}`,
            LogPriority.DEBUG,
        );
    } else {
        return (
            await repoFactory(IngestEndpointEnvironment).findByIdThrows(
                app.usageIngestEndpointEnvironmentId,
                userMessages.usageFailed,
            )
        ).id.toString();
    }
};

export const buildRevisionConfig = async (
    revision: Revision,
    environment?: Environment,
): Promise<{ [k: string]: any }> => {
    const config = container.get<BaseConfig>(TYPES.BackendConfig);
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    const app = await repoFactory(App).findByIdThrows(revision.appId, userMessages.appFailed);

    //we need to bundle in the core primary asset...
    const appPlatformRevisions = await repoFactory(AppPlatformRevision).findByIds(
        revision.appPlatformRevisionIds,
    );
    const platformRevisions = await repoFactory(PlatformRevision).findByIds(
        appPlatformRevisions.map((_) => _.platformRevisionId),
    );
    const platforms = await repoFactory(Platform).findByIds(
        platformRevisions.map((_) => _.platformId),
    );
    //get actions as we need to address any potential deps...
    const actions = await repoFactory(Action).find({
        _revision_id: revision.id,
    });
    const linkedIngestEndpointIds = (
        await repoFactory(Dependency).find({
            _model_id: { $in: actions.map((_) => _.id) },
            _model_name: Action.name,
            _depends_on_model_name: IngestEndpointEnvironment.name,
        })
    ).map((_) => _.dependsOnModelId);
    const ingestEndpointEnvironments = await repoFactory(IngestEndpointEnvironment).findByIds(
        linkedIngestEndpointIds,
    );

    const corePlatform = platforms.find((_) => _.isCore);
    if (corePlatform === undefined) {
        // Hide message in production
        throw new DataError('Core platform has not been linked', userMessages.genericDataFailure); //this should not be possible :)
    } else {
        const corePlatformRevision = platformRevisions.find((_) =>
            _.platformId.equals(corePlatform.id),
        );
        const conf = {
            built: new Date().toUTCString(),
            usageIngestEnvId: await getAppUsageIngestEnvironmentId(app),
            orgId: revision.orgId.toString(),
            appId: revision.appId.toString(),
            isAnalyticsEnabled: app.analyticsEnabled,
            isErrorTrackingEnabled: app.errorTrackingEnabled,
            isCommercial: config.isCommercial(),
            envId: environment === undefined ? 'PREVIEW' : environment.id.toString(),
            envVars:
                environment === undefined
                    ? {}
                    : environment.environmentVariables.reduce((obj, item) => {
                          (obj as any)[item.key] = item.value;
                          return obj;
                      }, {}),
            revisionId: revision.id.toString(),
            corePlatformId: corePlatform.id.toString(),
            corePlatformRevisionId: corePlatformRevision?.id.toString(),
            ingestEndpointEnvironments: ingestEndpointEnvironments.reduce((obj, v) => {
                (obj as any)[v.id.toString()] = getIngestEndpointInstallDomain(v);
                return obj;
            }, {}),
            models: await generateConfig(revision),
        };
        const primaryAsset = await repoFactory(PlatformAsset).findOneThrows(
            {
                _platform_id: corePlatform.id,
                _revision_id: corePlatformRevision?.id,
                _is_primary: true,
            },
            userMessages.platformFailed,
        );
        const entry = `${corePlatformRevision?.id.toString()}/${primaryAsset.name}`;

        const primaryAssetMap = (
            await Promise.all(
                platformRevisions.map(async (_) => {
                    const primary = await repoFactory(PlatformAsset).findOne({
                        _revision_id: _.id,
                        _is_primary: true,
                    });
                    if (primary === null) {
                        return {
                            id: _.platformId.toString(),
                            path: 'TEMPLATED',
                        };
                    } else {
                        return {
                            id: _.platformId.toString(),
                            path: `${_.platformId.toString()}/${_.id.toString()}-${primary.name}`,
                        };
                    }
                }),
            )
        ).reduce((obj, item) => {
            (obj as any)[item.id] = item.path;
            return obj;
        }, {});

        const allAssetsMap = (
            await Promise.all(
                platformRevisions.map(async (_) => {
                    return (
                        await repoFactory(PlatformAsset).find({
                            _revision_id: _.id,
                        })
                    ).map((asset) => {
                        return {
                            id: `${_.platformId.toString()}-${asset.name}`,
                            path: `${_.platformId.toString()}/${_.id.toString()}-${asset.name}`,
                        };
                    });
                }),
            )
        )
            .flat()
            .reduce((obj, item) => {
                (obj as any)[item.id] = item.path;
                return obj;
            }, {});

        return {
            ...conf,
            ...{ entry: entry, primaryAssetMap: primaryAssetMap, allAssetsMap: allAssetsMap },
        };
    }
};

export const buildConfig = async (environment: Environment): Promise<void> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const storage = container.get<BaseStorage>(TYPES.BackendStorage);
    const config = container.get<BaseConfig>(TYPES.BackendConfig);

    const revision = await repoFactory(Revision).findByIdThrows(
        environment.revisionId ?? '',
        userMessages.revisionFailed,
    );

    const uploadTo = async (fileName: string) =>
        storage.setAsString(
            await config.getConfigsBucket(),
            `tag-domain/${fileName}`,
            JSON.stringify(await buildRevisionConfig(revision, environment)),
            {
                contentType: 'application/json',
            },
        );

    await uploadTo(`${getCNAME(environment)}.json`);

    if (environment.customDomain !== undefined) {
        await uploadTo(`${environment.customDomain}.json`);
    }
};

export const createEnvironment = async (
    actor: User,
    app: App,
    name: string,
    revision: Revision,
    url?: string,
    environmentVariables: EnvironmentVariable[] = [],
    comments?: string,
): Promise<Environment> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const environment = await repoFactory(Environment).save(
        new Environment(name, app, revision, url, environmentVariables),
        actor,
        {
            gqlMethod: GQLMethod.CREATE,
            userComments: comments,
        },
    );
    await createCname(environment);
    await buildConfig(environment);
    return environment;
};
