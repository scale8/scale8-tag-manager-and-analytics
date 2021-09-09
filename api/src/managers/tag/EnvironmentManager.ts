import Manager from '../../abstractions/Manager';
import { inject, injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import Environment from '../../mongo/models/tag/Environment';
import CTX from '../../gql/ctx/CTX';
import { ObjectId, ObjectID } from 'mongodb';
import Revision from '../../mongo/models/tag/Revision';
import App from '../../mongo/models/tag/App';
import GQLError from '../../errors/GQLError';
import EnvironmentVariable from '../../mongo/models/EnvironmentVariable';
import TYPES from '../../container/IOC.types';
import Route53Service from '../../aws/Route53Service';
import OperationOwner from '../../enums/OperationOwner';
import GQLMethod from '../../enums/GQLMethod';
import userMessages from '../../errors/UserMessages';
import { uploadCertificate } from '../../utils/CertificateUtils';
import {
    buildConfig,
    createEnvironment,
    getCNAME,
    isEnvironmentVariableNameValid,
} from '../../utils/EnvironmentUtils';
import BaseDatabase from '../../backends/databases/abstractions/BaseDatabase';
import { fetchEventRequests } from '../../utils/EventRequestsUtils';

@injectable()
export default class EnvironmentManager extends Manager<Environment> {
    @inject(TYPES.BackendDatabase) private backendDatabase!: BaseDatabase;
    @inject(TYPES.Route53Service) private route53Service!: Route53Service;

    protected gqlSchema = gql`
        """
        @model
        """
        type Environment {
            """
            \`Environment\` ID
            """
            id: ID!
            """
            \`Environment\` name
            """
            name: String!
            """
            \`Environment\` URL
            """
            url: String
            """
            \`Environment\`'s custom domain name if configured
            """
            custom_domain: String
            """
            \`Environment\`'s install domain used to embed in web page
            """
            install_domain: String!
            """
            \`Environment\`'s CNAME
            """
            cname: String!
            """
            \`Revision\` currently attached to the \`Environment\`
            """
            revision: Revision!
            """
            The date the \`Environment\` was created at
            """
            created_at: DateTime!
            """
            The date the \`Environment\` was last updated at
            """
            updated_at: DateTime!
            """
            Environment variables associated with this \`Environment\`
            """
            environment_variables: [EnvironmentVariable!]!
            """
            Event request stats - Pleae note that environment is automatically set in the filter options
            """
            event_request_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
        }

        input EnvironmentVariableInput {
            """
            Environment variable key
            """
            key: String!
            """
            Environment variable value
            """
            value: String!
        }

        input EnvironmentCreateInput {
            """
            The \`App\` under which the \`Environment\` should be created
            """
            app_id: ID!
            """
            \`Revision\` ID to be connected with the \`Environment\`
            """
            revision_id: ID!
            """
            A custom domain name to be associated with this \`Environment\`
            """
            custom_domain: String
            """
            If a custom domain is provided, a certificate is required to handle secure web traffic
            """
            cert_pem: String
            """
            If a custom domain is provided, a key is required to handle secure web traffic
            """
            key_pem: String
            """
            The name of the new \`Environment\` being created
            """
            name: String!
            """
            The base URL of the new \`Environment\` being created
            """
            url: String
            """
            Environment variables
            """
            env_vars: [EnvironmentVariableInput!]
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input EnvironmentDeleteInput {
            """
            \`Environment\` ID to delete against
            """
            environment_id: ID!
        }

        """
        Update an \`Environment\`'s properties
        """
        input EnvironmentUpdateInput {
            """
            \`Environment\` ID to update data against
            """
            environment_id: ID!
            """
            \`Revision\` ID to be connected with the \`Environment\`
            """
            revision_id: ID!
            """
            \`Environment\` name
            """
            name: String
            """
            The base URL of the \`Environment\`
            """
            url: String
            """
            If a custom domain is used a new certificate can be installed which will replace the exiting one
            """
            cert_pem: String
            """
            If a custom domain is used a new key can be installed which will replace the exiting one
            """
            key_pem: String
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input EnvironmentVariableAddInput {
            """
            \`Environment\` ID to add a new environment variable against
            """
            environment_id: ID!
            """
            Environment variable key
            """
            key: String!
            """
            Environment variable value
            """
            value: String!
        }

        input EnvironmentVariableDeleteInput {
            """
            \`Environment\` ID to reference to delete an environment variable against
            """
            environment_id: ID!
            """
            Environment variable key to be deleted
            """
            key: String!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=Environment
            Create a new \`Environment\`.
            """
            createEnvironment(environmentCreateInput: EnvironmentCreateInput!): Environment!
            """
            @bound=Environment
            Update an \`Environment\`'s details.
            """
            updateEnvironment(environmentUpdateInput: EnvironmentUpdateInput!): Boolean!
            """
            @bound=Environment
            Delete an \`Environment\`.
            """
            deleteEnvironment(environmentDeleteInput: EnvironmentDeleteInput!): Boolean!
            """
            @bound=Environment
            Add an environment variable
            """
            addEnvironmentVariable(
                environmentVariableAddInput: EnvironmentVariableAddInput!
            ): Boolean!
            """
            @bound=Environment
            Delete an environment variable
            """
            deleteEnvironmentVariable(
                environmentVariableDeleteInput: EnvironmentVariableDeleteInput!
            ): Boolean!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=Environment
            Get an \`Environment\` model from \`Environment\` ID
            """
            getEnvironment(id: ID!): Environment!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getEnvironment: async (parent: any, args: any, ctx: CTX) => {
            const environment = await this.repoFactory(Environment).findByIdThrows(
                new ObjectID(args.id),
                userMessages.environmentFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(ctx, environment.orgId, async () =>
                environment.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        addEnvironmentVariable: async (parent: any, args: any, ctx: CTX) => {
            const data = args.environmentVariableAddInput;
            const environment = await this.repoFactory(Environment).findByIdThrows(
                new ObjectId(data.environment_id),
                userMessages.environmentFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(ctx, environment.orgId, async (me) => {
                if (!isEnvironmentVariableNameValid(data.key)) {
                    throw new GQLError(userMessages.envKeyInvalid, true);
                }
                const envMap = new Map(
                    environment.environmentVariables.map((_) => [_.key, _.value]),
                );
                envMap.set(data.key, data.value);
                environment.environmentVariables = Array.from(envMap).map(
                    ([k, v]) => new EnvironmentVariable(k, v),
                );
                await buildConfig(await this.repoFactory(Environment).save(environment, me));
                return true;
            });
        },
        deleteEnvironmentVariable: async (parent: any, args: any, ctx: CTX) => {
            const data = args.environmentVariableDeleteInput;
            const environment = await this.repoFactory(Environment).findByIdThrows(
                new ObjectId(data.environment_id),
                userMessages.environmentFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(ctx, environment.orgId, async (me) => {
                environment.environmentVariables = environment.environmentVariables.filter(
                    (_) => _.key !== data.key,
                );
                await buildConfig(await this.repoFactory(Environment).save(environment, me));
                return true;
            });
        },
        deleteEnvironment: async (parent: any, args: any, ctx: CTX) => {
            const data = args.environmentDeleteInput;
            const environment = await this.repoFactory(Environment).findByIdThrows(
                new ObjectId(data.environment_id),
                userMessages.environmentFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(ctx, environment.orgId, async (me) => {
                await this.repoFactory(Environment).delete(environment, me);
                return true;
            });
        },
        updateEnvironment: async (parent: any, args: any, ctx: CTX) => {
            const data = args.environmentUpdateInput;
            const environment = await this.repoFactory(Environment).findByIdThrows(
                new ObjectId(data.environment_id),
                userMessages.environmentFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, environment.orgId, async (me) => {
                //we are trying to attach a new revision to this environment
                const revision = await this.repoFactory(Revision).findOneThrows(
                    {
                        _id: new ObjectID(data.revision_id),
                        _tag_manager_account_id: environment.tagManagerAccountId,
                    },
                    userMessages.revisionFailed,
                );
                //we need to check this revision is ok to attach...
                if (revision.isFinal) {
                    environment.revisionId = revision.id;
                } else {
                    throw new GQLError(userMessages.revisionNotFinalAttaching, true);
                }

                if (
                    this.config.isCommercial() &&
                    data.cert_pem !== undefined &&
                    data.key_pem !== undefined
                ) {
                    //trying to install a new certificate...
                    if (environment.customDomain === undefined) {
                        throw new GQLError(userMessages.envNoCustomDomain, true);
                    } else {
                        await uploadCertificate(
                            environment.customDomain,
                            data.cert_pem,
                            data.key_pem,
                        );
                    }
                }
                environment.bulkGQLSet(data, ['name', 'url']); //only is a safety check against this function
                await buildConfig(
                    await this.repoFactory(Environment).save(environment, me, OperationOwner.USER, {
                        gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                        userComments: data.comments,
                    }),
                );
                return true;
            });
        },
        createEnvironment: async (parent: any, args: any, ctx: CTX) => {
            const data = args.environmentCreateInput;
            const app = await this.repoFactory(App).findByIdThrows(
                new ObjectId(data.app_id),
                userMessages.appFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, app.orgId, async (me) => {
                const getEnvVars: () => EnvironmentVariable[] = () => {
                    if (Array.isArray(data.env_vars)) {
                        return (data.env_vars as { key: string; value: string }[]).map((_) => {
                            if (!isEnvironmentVariableNameValid(_.key)) {
                                throw new GQLError(userMessages.envKeyInvalid, true);
                            }
                            return new EnvironmentVariable(_.key, _.value);
                        });
                    }
                    return [];
                };
                const getRevision: () => Promise<Revision> = async () => {
                    //we are trying to attach a new revision to this environment
                    const revision = await this.repoFactory(Revision).findOneThrows(
                        {
                            _id: new ObjectID(data.revision_id),
                            _tag_manager_account_id: app.tagManagerAccountId,
                        },
                        userMessages.revisionFailed,
                    );
                    //we need to check this revision is ok to attach...
                    if (revision.isFinal) {
                        return revision;
                    } else {
                        throw new GQLError(userMessages.revisionNotFinalAttaching, true);
                    }
                };
                const environmentVariables = getEnvVars();
                const revision = await getRevision();
                const environment = await createEnvironment(
                    me,
                    app,
                    data.name,
                    revision,
                    data.url,
                    this.config.isCommercial() ? data.custom_domain : undefined,
                    this.config.isCommercial() ? data.cert_pem : undefined,
                    this.config.isCommercial() ? data.key_pem : undefined,
                    environmentVariables,
                    undefined,
                    data.comments,
                );
                return environment.toGQLType();
            });
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        Environment: {
            cname: async (parent: any) => getCNAME(parent.id),
            install_domain: async (parent: any, args: any, ctx: CTX) => {
                const env = await this.repoFactory(Environment).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.environmentFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, env.orgId, async () => {
                    if (env.customDomain === undefined) {
                        return getCNAME(env.id);
                    } else {
                        return env.customDomain;
                    }
                });
            },
            revision: async (parent: any, args: any, ctx: CTX) => {
                const env = await this.repoFactory(Environment).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.environmentFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, env.orgId, async () => {
                    return (
                        await this.repoFactory(Revision).findByIdThrows(
                            env.revisionId,
                            userMessages.revisionFailed,
                        )
                    ).toGQLType();
                });
            },
            environment_variables: async (parent: any, args: any, ctx: CTX) => {
                const env = await this.repoFactory(Environment).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.environmentFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, env.orgId, async () => {
                    return env.environmentVariables.map((_) => ({
                        key: _.key,
                        value: _.value,
                    }));
                });
            },
            event_request_stats: async (parent: any, args: any, ctx: CTX) => {
                const env = await this.repoFactory(Environment).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.environmentFailed,
                );
                return fetchEventRequests('environment', env, args, ctx);
            },
        },
    };
}
