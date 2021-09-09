import container from '../../container/IOC.config';
import BaseConfig from '../../backends/configuration/abstractions/BaseConfig';
import TYPES from '../../container/IOC.types';

export default class StripeProducts {
    public static getTagManagerProductConfig(): {
        plans: {
            id: string;
            name: string;
            amount: number;
            page_views: number;
        }[];
    } {
        const config = container.get<BaseConfig>(TYPES.BackendConfig);

        if (config.isNotCommercial()) {
            return {
                plans: [],
            };
        }

        return {
            plans: [
                {
                    name: 'Scale8 Tag Manager - 5K',
                    id: 'S8_TM_PLAN_5K',
                    amount: 500,
                    page_views: 5000,
                },
                {
                    name: 'Scale8 Tag Manager - 50K',
                    id: 'S8_TM_PLAN_50K',
                    amount: 800,
                    page_views: 50000,
                },
                {
                    name: 'Scale8 Tag Manager - 100K',
                    id: 'S8_TM_PLAN_100K',
                    amount: 1100,
                    page_views: 100000,
                },
                {
                    name: 'Scale8 Tag Manager - 250K',
                    id: 'S8_TM_PLAN_250K',
                    amount: 1500,
                    page_views: 250000,
                },
                {
                    name: 'Scale8 Tag Manager - 500K',
                    id: 'S8_TM_PLAN_500K',
                    amount: 2500,
                    page_views: 500000,
                },
                {
                    name: 'Scale8 Tag Manager - 1000K',
                    id: 'S8_TM_PLAN_1000K',
                    amount: 4500,
                    page_views: 1000000,
                },
                {
                    name: 'Scale8 Tag Manager - 2500K',
                    id: 'S8_TM_PLAN_2500K',
                    amount: 7500,
                    page_views: 2500000,
                },
                {
                    name: 'Scale8 Tag Manager - 5000K',
                    id: 'S8_TM_PLAN_5000K',
                    amount: 8900,
                    page_views: 5000000,
                },
                {
                    name: 'Scale8 Tag Manager - 10000K',
                    id: 'S8_TM_PLAN_10000K',
                    amount: 12500,
                    page_views: 10000000,
                },
            ],
        };
    }

    public static getDataManagerProductConfig(): {
        plans: {
            id: string;
            name: string;
            amount: number;
            requests: number;
            gbs: number;
        }[];
    } {
        const config = container.get<BaseConfig>(TYPES.BackendConfig);

        if (config.isNotCommercial()) {
            return {
                plans: [],
            };
        }

        return {
            plans: [
                {
                    name: 'Scale8 Data Manager - 50K',
                    id: 'S8_DM_PLAN_50K',
                    amount: 500,
                    requests: 50000,
                    gbs: 0.5,
                },
                {
                    name: 'Scale8 Data Manager - 100K',
                    id: 'S8_DM_PLAN_100K',
                    amount: 700,
                    requests: 100000,
                    gbs: 1,
                },
                {
                    name: 'Scale8 Data Manager - 250K',
                    id: 'S8_DM_PLAN_250K',
                    amount: 900,
                    requests: 250000,
                    gbs: 2.5,
                },
                {
                    name: 'Scale8 Data Manager - 500K',
                    id: 'S8_DM_PLAN_500K',
                    amount: 1200,
                    requests: 500000,
                    gbs: 5,
                },
                {
                    name: 'Scale8 Data Manager - 1000K',
                    id: 'S8_DM_PLAN_1000K',
                    amount: 1600,
                    requests: 1000000,
                    gbs: 10,
                },
                {
                    name: 'Scale8 Data Manager - 2500K',
                    id: 'S8_DM_PLAN_2500K',
                    amount: 2800,
                    requests: 2500000,
                    gbs: 25,
                },
                {
                    name: 'Scale8 Data Manager - 5000K',
                    id: 'S8_DM_PLAN_5000K',
                    amount: 4500,
                    requests: 5000000,
                    gbs: 50,
                },
                {
                    name: 'Scale8 Data Manager - 10000K',
                    id: 'S8_DM_PLAN_10000K',
                    amount: 7000,
                    requests: 10000000,
                    gbs: 100,
                },
                {
                    name: 'Scale8 Data Manager - 20000K',
                    id: 'S8_DM_PLAN_20000K',
                    amount: 11100,
                    requests: 20000000,
                    gbs: 250,
                },
            ],
        };
    }
}
