import { ListProductData } from '../types/ProductTypes';

type Account = {
    enabled: boolean;
    trial_expired: boolean;
    is_trial: boolean;
};

type Org = {
    manual_invoicing: boolean;
    tag_manager_account: Account & {
        stripe_product_id: string | null;
    };
    data_manager_account: Account & {
        stripe_product_id: string | null;
    };
};

type PlanDetails = {
    state: string;
    pageViews?: string;
    requests?: string;
    gbs?: string;
    price: number;
};

export const accountDetailsFromOrgWithAccounts = (
    org: Org,
    tagManagerProducts: ListProductData[],
    dataManagerProducts: ListProductData[],
) => {
    const tagManagerAccount = org.tag_manager_account;
    const tagManagerProductId = tagManagerAccount.stripe_product_id;
    const dataManagerAccount = org.data_manager_account;
    const dataManagerProductId = dataManagerAccount.stripe_product_id;

    const currentTagManagerProduct = tagManagerProductId
        ? tagManagerProducts.find((_) => _.id === tagManagerProductId)
        : undefined;

    const currentDataManagerProduct = dataManagerProductId
        ? dataManagerProducts.find((_) => _.id === dataManagerProductId)
        : undefined;

    return {
        tagManagerAccount,
        tagManagerProductId,
        dataManagerAccount,
        dataManagerProductId,
        currentTagManagerProduct,
        currentDataManagerProduct,
    };
};

export const buildTagManagerPlanDetails = (
    org: Org,
    account: Account,
    product?: ListProductData,
) => {
    if (!account.enabled) {
        return {
            state: 'Inactive',
            pageViews: '',
            price: 0,
        };
    }
    if (org.manual_invoicing) {
        return {
            state: 'Manual Invoicing',
            pageViews: '',
            price: 0,
        };
    }
    if (account.trial_expired) {
        return {
            state: 'Trial Expired',
            pageViews: '',
            price: 0,
        };
    }
    if (account.is_trial) {
        return {
            state: 'Trial',
            pageViews: '',
            price: 0,
        };
    }
    if (!product) {
        return {
            state: 'Unavailable',
            pageViews: '',
            price: 0,
        };
    }
    return {
        state: 'Active',
        pageViews: product?.page_views?.toLocaleString('en-GB') ?? '',
        price: (product?.amount ?? 0) / 100,
    };
};

export const buildDataManagerPlanDetails = (
    org: Org,
    account: Account,
    product?: ListProductData,
) => {
    if (!account.enabled) {
        return {
            state: 'Inactive',
            requests: '',
            gbs: '',
            price: 0,
        };
    }
    if (org.manual_invoicing) {
        return {
            state: 'Manual Invoicing',
            requests: '',
            gbs: '',
            price: 0,
        };
    }
    if (account.trial_expired) {
        return {
            state: 'Trial Expired',
            requests: '',
            gbs: '',
            price: 0,
        };
    }
    if (account.is_trial) {
        return {
            state: 'Trial',
            requests: '',
            gbs: '',
            price: 0,
        };
    }
    if (!product) {
        return {
            state: 'Unavailable',
            requests: '',
            gbs: '',
            price: 0,
        };
    }
    return {
        state: 'Active',
        requests: product?.requests?.toLocaleString('en-GB') ?? '',
        gbs: product?.gbs?.toLocaleString('en-GB') ?? '',
        price: (product?.amount ?? 0) / 100,
    };
};

export const planDetailsToString = (planDetails: PlanDetails) => {
    if (planDetails.state === 'Active') {
        if (planDetails.pageViews) {
            return `${planDetails.state} - r ${planDetails.pageViews}`;
        }
        return `${planDetails.state} - r ${planDetails.requests} - gbs ${planDetails.gbs}`;
    }
    return planDetails.state;
};
