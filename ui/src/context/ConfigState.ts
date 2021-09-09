import { Mode } from '../gql/generated/globalTypes';
import { ConfigQueryData } from '../gql/generated/ConfigQueryData';
import { ListProductData } from '../dialogPages/global/orgSettings/ProductList';

export type ConfigState = {
    mode: Mode;
    useSignup: boolean;
    useEmail: boolean;
    useGithubSSO: boolean;
    useTwoFactorAuth: boolean;
    isConfigured: boolean;
    consentPurposes: { id: number; name: string }[];
    consentVendors: { id: number; name: string }[];
    tagManagerProducts: ListProductData[];
    dataManagerProducts: ListProductData[];
};

export const configInitialState = {
    mode: Mode.SELF_HOSTED,
    useSignup: false,
    useEmail: false,
    useGithubSSO: false,
    useTwoFactorAuth: false,
    isConfigured: false,
    consentPurposes: [],
    consentVendors: [],
    tagManagerProducts: [],
    dataManagerProducts: [],
};

export const configStateFromData = (data?: ConfigQueryData): ConfigState => ({
    mode: data?.config.mode ?? Mode.SELF_HOSTED,
    useSignup: data?.config.use_signup ?? false,
    useEmail: data?.config.use_email ?? false,
    useGithubSSO: data?.config.use_github_sso ?? false,
    useTwoFactorAuth: data?.config.use_two_factor_auth ?? false,
    isConfigured: data?.config.is_configured ?? false,
    consentPurposes: data?.config.consent_purposes ?? [],
    consentVendors: data?.config.consent_vendors ?? [],
    tagManagerProducts: data?.config.tag_manager_products ?? [],
    dataManagerProducts: data?.config.data_manager_products ?? [],
});
