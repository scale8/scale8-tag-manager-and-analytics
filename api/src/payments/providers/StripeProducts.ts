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
            selectable: boolean;
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
                    amount: 1000,
                    page_views: 5000,
                    selectable: true,
                },
                {
                    name: 'Scale8 Tag Manager - 50K',
                    id: 'S8_TM_PLAN_50K',
                    amount: 1600,
                    page_views: 50000,
                    selectable: true,
                },
                {
                    name: 'Scale8 Tag Manager - 100K',
                    id: 'S8_TM_PLAN_100K',
                    amount: 2200,
                    page_views: 100000,
                    selectable: true,
                },
                {
                    name: 'Scale8 Tag Manager - 250K',
                    id: 'S8_TM_PLAN_250K',
                    amount: 3000,
                    page_views: 250000,
                    selectable: true,
                },
                {
                    name: 'Scale8 Tag Manager - 500K',
                    id: 'S8_TM_PLAN_500K',
                    amount: 5000,
                    page_views: 500000,
                    selectable: true,
                },
                {
                    name: 'Scale8 Tag Manager - 1000K',
                    id: 'S8_TM_PLAN_1000K',
                    amount: 9000,
                    page_views: 1000000,
                    selectable: true,
                },
                {
                    name: 'Scale8 Tag Manager - 2500K',
                    id: 'S8_TM_PLAN_2500K',
                    amount: 15000,
                    page_views: 2500000,
                    selectable: true,
                },
                {
                    name: 'Scale8 Tag Manager - 5000K',
                    id: 'S8_TM_PLAN_5000K',
                    amount: 17800,
                    page_views: 5000000,
                    selectable: true,
                },
                {
                    name: 'Scale8 Tag Manager - 10000K',
                    id: 'S8_TM_PLAN_10000K',
                    amount: 25000,
                    page_views: 10000000,
                    selectable: true,
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
            selectable: boolean;
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
                    amount: 1000,
                    requests: 50000,
                    gbs: 0.5,
                    selectable: true,
                },
                {
                    name: 'Scale8 Data Manager - 100K',
                    id: 'S8_DM_PLAN_100K',
                    amount: 1400,
                    requests: 100000,
                    gbs: 1,
                    selectable: true,
                },
                {
                    name: 'Scale8 Data Manager - 250K',
                    id: 'S8_DM_PLAN_250K',
                    amount: 1800,
                    requests: 250000,
                    gbs: 2.5,
                    selectable: true,
                },
                {
                    name: 'Scale8 Data Manager - 500K',
                    id: 'S8_DM_PLAN_500K',
                    amount: 2400,
                    requests: 500000,
                    gbs: 5,
                    selectable: true,
                },
                {
                    name: 'Scale8 Data Manager - 1000K',
                    id: 'S8_DM_PLAN_1000K',
                    amount: 3200,
                    requests: 1000000,
                    gbs: 10,
                    selectable: true,
                },
                {
                    name: 'Scale8 Data Manager - 2500K',
                    id: 'S8_DM_PLAN_2500K',
                    amount: 5600,
                    requests: 2500000,
                    gbs: 25,
                    selectable: true,
                },
                {
                    name: 'Scale8 Data Manager - 5000K',
                    id: 'S8_DM_PLAN_5000K',
                    amount: 9000,
                    requests: 5000000,
                    gbs: 50,
                    selectable: true,
                },
                {
                    name: 'Scale8 Data Manager - 10000K',
                    id: 'S8_DM_PLAN_10000K',
                    amount: 14000,
                    requests: 10000000,
                    gbs: 100,
                    selectable: true,
                },
                {
                    name: 'Scale8 Data Manager - 20000K',
                    id: 'S8_DM_PLAN_20000K',
                    amount: 22200,
                    requests: 20000000,
                    gbs: 250,
                    selectable: true,
                },
            ],
        };
    }
}
