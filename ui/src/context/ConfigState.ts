import { Mode } from '../gql/generated/globalTypes';
import { ConfigQueryData } from '../gql/generated/ConfigQueryData';
import { ListProductData } from '../types/ProductTypes';

export type ConfigState = {
    mode: Mode;
    useSignup: boolean;
    useEmail: boolean;
    useGithubSSO: boolean;
    useTwoFactorAuth: boolean;
    isAuditEnabled: boolean;
    stripePublishable: string;
    captchaPublishable: string;
    isConfigured: boolean;
    isDev: boolean;
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
    isAuditEnabled: false,
    isConfigured: false,
    isDev: false,
    stripePublishable: '',
    captchaPublishable: '',
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
    isAuditEnabled: data?.config.is_audit_enabled ?? false,
    stripePublishable: data?.config.stripe_publishable ?? '',
    captchaPublishable: data?.config.captcha_publishable ?? '',
    isConfigured: data?.config.is_configured ?? false,
    isDev: data?.config.is_dev ?? false,
    consentPurposes: data?.config.consent_purposes ?? [],
    consentVendors: data?.config.consent_vendors ?? [],
    tagManagerProducts: data?.config.tag_manager_products ?? [],
    dataManagerProducts: data?.config.data_manager_products ?? [],
});
