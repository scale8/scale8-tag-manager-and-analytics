import { inject, injectable } from 'inversify';
import TYPES from '../container/IOC.types';
import { GraphQLScalarType } from 'graphql';
import DateTime from './scalars/DateTime';
import Manager from '../abstractions/Manager';
import Model from '../mongo/abstractions/Model';
import JSON from './scalars/JSON';
import GQLManagersFactory from '../container/factoryTypes/GQLManagersFactory';
import DataMapValue from './scalars/DataMapValue';
import { ISO } from '../core/ISO';
import TimeZones from '../core/TimeZones';
import got from 'got';
import GQLError from '../errors/GQLError';
import userMessages from '../errors/UserMessages';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import Platform from '../mongo/models/tag/Platform';
import PlatformEvent from '../mongo/models/tag/PlatformEvent';
import PlatformDataMap from '../mongo/models/tag/PlatformDataMap';
import PlatformAction from '../mongo/models/tag/PlatformAction';
import PlatformDataContainer from '../mongo/models/tag/PlatformDataContainer';
import { AppType } from '../enums/AppType';
import { TagType } from '../enums/TagType';
import { ActionGroupDistributionType } from '../enums/ActionGroupDistributionType';
import { ConditionType } from '../enums/ConditionType';
import BaseLogger from '../backends/logging/abstractions/BaseLogger';
import StripeProducts from '../payments/providers/StripeProducts';
import Org from '../mongo/models/Org';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import { InputType } from '../../../common/enums/InputType';

type CoreElementDataMapDescription = {
    name: string;
    description: string;
    var_type: string;
    default_value: string;
    is_required: string;
};

type CoreElementDescription = {
    name: string;
    description: string;
    inputs: CoreElementDataMapDescription[];
};

@injectable()
export default class ResolverRegister {
    @inject(TYPES.RepoFromModelFactory) protected repoFactory!: RepoFromModelFactory;
    @inject(TYPES.BackendConfig) private readonly config!: BaseConfig;

    protected managers: Manager<Model>[] = [];
    protected logger: BaseLogger;

    public constructor(
        @inject(TYPES.GQLManagersFactory) managersFactory: GQLManagersFactory,
        @inject(TYPES.BackendLogger) logger: BaseLogger,
    ) {
        this.managers = managersFactory();
        this.logger = logger;
    }

    private static enumToStringMap(enumType: Record<string, unknown>): { v: string; k: string }[] {
        return Object.keys(enumType).map((_) => {
            return {
                k: _,
                v: _.toUpperCase()
                    .replace(/_/g, ' ')
                    .replace(/([a-z])([a-z]+)/gi, (s, a, b) => {
                        return `${a}${b.toLowerCase()}`;
                    }),
            };
        });
    }

    private static async getIABConsentData(): Promise<{
        purposes: { name: any; id: any }[];
        vendors: { name: any; id: any }[];
    }> {
        const { body } = await got.get(
            'https://quantcast.mgr.consensu.org/GVL-v2/vendor-list.json',
            {
                responseType: 'json',
            },
        );
        if (
            body !== null &&
            typeof body === 'object' &&
            (body as Record<string, unknown>).hasOwnProperty('purposes') &&
            (body as Record<string, unknown>).hasOwnProperty('vendors')
        ) {
            return {
                vendors: Object.values((body as any).vendors).map((_: any) => {
                    return {
                        id: _.id,
                        name: _.name,
                    };
                }),
                purposes: Object.values((body as any).purposes).map((_: any) => {
                    return {
                        id: _.id,
                        name: _.name,
                    };
                }),
            };
        } else {
            throw new GQLError(userMessages.iabListError, true);
        }
    }

    private async getCorePlatform(): Promise<Platform> {
        return this.repoFactory(Platform).findOneThrows({ _is_core: true });
    }

    private async getCoreDataMapsForCoreElement(
        coreElement: PlatformEvent | PlatformAction | PlatformDataContainer,
    ): Promise<CoreElementDataMapDescription[]> {
        return (
            await this.repoFactory(PlatformDataMap).findByIds(coreElement.platformDataMapIds)
        ).map((corePlatformDataMaps) => {
            return {
                name: corePlatformDataMaps.key,
                description: corePlatformDataMaps.description,
                var_type: corePlatformDataMaps.varType,
                default_value:
                    corePlatformDataMaps.defaultValue === undefined
                        ? ''
                        : corePlatformDataMaps.defaultValue.toString(),
                is_required: corePlatformDataMaps.isOptional ? 'No' : 'Yes',
            };
        });
    }

    private async getCoreActions(): Promise<CoreElementDescription[]> {
        const corePlatformActions = await this.repoFactory(PlatformAction).find({
            _platform_id: (await this.getCorePlatform()).id,
        });
        return await Promise.all(
            corePlatformActions.map(async (corePlatformAction) => {
                return {
                    name: corePlatformAction.name,
                    description: corePlatformAction.description,
                    inputs: await this.getCoreDataMapsForCoreElement(corePlatformAction),
                };
            }),
        );
    }

    private async getCoreEvents(): Promise<CoreElementDescription[]> {
        const corePlatformEvents = await this.repoFactory(PlatformEvent).find({
            _platform_id: (await this.getCorePlatform()).id,
        });
        return await Promise.all(
            corePlatformEvents.map(async (corePlatformEvent) => {
                return {
                    name: corePlatformEvent.name,
                    description: corePlatformEvent.description,
                    inputs: await this.getCoreDataMapsForCoreElement(corePlatformEvent),
                };
            }),
        );
    }

    private async getCoreDataContainers(): Promise<CoreElementDescription[]> {
        const corePlatformDataContainers = await this.repoFactory(PlatformDataContainer).find({
            _platform_id: (await this.getCorePlatform()).id,
        });
        return await Promise.all(
            corePlatformDataContainers.map(async (corePlatformDataContainer) => {
                return {
                    name: corePlatformDataContainer.name,
                    description: corePlatformDataContainer.description,
                    inputs: await this.getCoreDataMapsForCoreElement(corePlatformDataContainer),
                };
            }),
        );
    }

    protected getQueryResolvers(): { [k: string]: any } {
        return {
            v: () => 'v1',
            config: async () => {
                // noinspection JSUnusedGlobalSymbols
                return {
                    is_configured:
                        this.config.isCommercial() || (await this.repoFactory(Org).count({})) > 1,
                    tag_manager_products: StripeProducts.getTagManagerProductConfig().plans.map(
                        (_) => {
                            return {
                                id: _.id,
                                amount: _.amount,
                                name: _.name,
                                page_views: _.page_views,
                            };
                        },
                    ),
                    data_manager_products: StripeProducts.getDataManagerProductConfig().plans.map(
                        (_) => {
                            return {
                                id: _.id,
                                amount: _.amount,
                                name: _.name,
                                requests: _.requests,
                                gbs: _.gbs,
                            };
                        },
                    ),
                    countries: Object.entries(ISO.countryCodes()).map((_) => {
                        return { k: _[0], v: _[1] };
                    }),
                    time_zones: Array.from(TimeZones.getTimeZones()).map((_) => {
                        return { k: _[0], v: _[1] };
                    }),
                    app_types: ResolverRegister.enumToStringMap(AppType),
                    condition_types: ResolverRegister.enumToStringMap(ConditionType),
                    input_types: ResolverRegister.enumToStringMap(InputType),
                    tag_types: ResolverRegister.enumToStringMap(TagType),
                    action_group_distribution_types: ResolverRegister.enumToStringMap(
                        ActionGroupDistributionType,
                    ),
                    consent_vendors: (await ResolverRegister.getIABConsentData()).vendors,
                    consent_purposes: (await ResolverRegister.getIABConsentData()).purposes,
                    core_events: await this.getCoreEvents(),
                    core_data_containers: await this.getCoreDataContainers(),
                    core_actions: await this.getCoreActions(),
                    mode: this.config.getMode(),
                    use_signup: await this.config.useSignup(),
                    use_two_factor_auth: await this.config.twoFactorAuthEnabled(),
                    use_github_sso: await this.config.gitHubSsoEnabled(),
                    use_email: await this.config.emailServerEnabled(),
                    is_audit_enabled: await this.config.isAuditEnabled(),
                    is_dev: this.config.isDevelopment(),
                };
            },
            ...this.managers
                .map((manager) => manager.getExtendedGQLQueryResolvers())
                .reduce((obj, n) => {
                    return { ...obj, ...n };
                }),
        };
    }

    protected getMutationResolvers(): { [k: string]: any } {
        return {
            v: () => 'v1',
            ...this.managers
                .map((manager) => manager.getExtendedGQLMutationResolvers())
                .reduce((obj, n) => {
                    return { ...obj, ...n };
                }),
        };
    }

    protected getCustomResolvers(): { [k: string]: any } {
        return {
            ...this.managers
                .map((manager) => manager.getGQLCustomResolvers())
                .reduce((obj, n) => {
                    return { ...obj, ...n };
                }),
            ...{
                DefaultValue: {
                    __resolveType: (obj: any) => {
                        if (obj.values !== undefined) {
                            return 'DefaultValueContainerArray';
                        } else if (obj.value !== undefined) {
                            return 'DefaultValueContainer';
                        } else {
                            return null;
                        }
                    },
                },
                GQLScalarBox: {
                    __resolveType: (obj: Record<string, unknown>) => {
                        if (obj.hasOwnProperty('s')) {
                            return 'StringBox';
                        } else if (obj.hasOwnProperty('i')) {
                            return 'IntBox';
                        } else if (obj.hasOwnProperty('f')) {
                            return 'FloatBox';
                        } else if (obj.hasOwnProperty('b')) {
                            return 'BooleanBox';
                        } else if (obj.hasOwnProperty('d')) {
                            return 'DateBox';
                        } else if (obj.hasOwnProperty('sa')) {
                            return 'StringArrayBox';
                        } else if (obj.hasOwnProperty('ia')) {
                            return 'IntArrayBox';
                        } else if (obj.hasOwnProperty('fa')) {
                            return 'FloatArrayBox';
                        } else if (obj.hasOwnProperty('ba')) {
                            return 'BooleanArrayBox';
                        } else if (obj.hasOwnProperty('da')) {
                            return 'DateArrayBox';
                        } else if (obj.hasOwnProperty('ea')) {
                            return 'EmptyArrayBox';
                        } else {
                            return null;
                        }
                    },
                },
            },
        };
    }

    protected getScalarResolvers(): { [k: string]: GraphQLScalarType } {
        return {
            DateTime: DateTime.def,
            JSON: JSON.def,
            DataMapValue: DataMapValue.def,
        };
    }

    public getResolvers(): { [k: string]: any } {
        const resolvers = {
            Query: this.getQueryResolvers(),
            Mutation: this.getMutationResolvers(),
            ...this.getScalarResolvers(),
            ...this.getCustomResolvers(),
        };
        this.logger.gql('Resolvers', resolvers).then();
        return resolvers;
    }
}
