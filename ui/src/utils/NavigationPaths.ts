import { AccountProduct } from '../gql/generated/globalTypes';

const buildQs = (params?: Record<string, string>) => {
    const qsDefinitions =
        params === undefined ? [] : Object.entries(params).map((_) => `${_[0]}=${_[1]}`);

    return `${params === undefined ? '' : '?'}${qsDefinitions.join('&')}`;
};

// Root
export const toLogin = '/login';
export const toSignUp = (params?: { type?: string; email?: string; github_id?: string }) =>
    `/sign-up${buildQs(params)}`;
export const toInstallTags = (params?: { env: string; target: string }) =>
    `/account-install-tags${buildQs(params)}`;
export const toRequestPasswordReset = (params?: { email: string }) =>
    `/request-password-reset${buildQs(params)}`;

// Testers
export const toTesters = '/testers';
export const toTagTester = '/testers/tag-tester';

// Logged
export const toAdmin = '/s8/admin/dashboard';
export const toSignupApproval = '/s8/admin/signup-approval';
export const toOrgSelect = `/s8/select-org`;
export const toOrgList = '/s8/orgs';

export const toOrg = (
    params: { id: string; next_id?: string; product?: string },
    page?: string,
) => {
    localStorage.setItem('orgid', params.id);
    const rootPath = `/s8/org`;
    switch (page) {
        case 'dashboard':
            return `${rootPath}/dashboard${buildQs(params)}`;
        case 'users':
            return `${rootPath}/users${buildQs(params)}`;
        case 'invites':
            return `${rootPath}/user-invites${buildQs(params)}`;
        case 'settings':
            return `${rootPath}/settings${buildQs(params)}`;
        case 'thanks':
            return `${rootPath}/thank-you${buildQs(params)}`;
        default:
            return `${rootPath}/dashboard${buildQs(params)}`;
    }
};

export const buildThankYouPath = (
    orgId: string,
    productId: string,
    accountProduct: AccountProduct,
): string => {
    return toOrg(
        {
            id: orgId,
            next_id: productId,
            product: accountProduct === AccountProduct.TAG_MANAGER ? 'tag-manager' : 'data-manger',
        },
        'thanks',
    );
};

export const toTagManager = (params: { id: string; action?: string }, page?: string): string => {
    const rootPath = `/s8/tag-manager`;
    switch (page) {
        case 'apps':
            return `${rootPath}/apps${buildQs(params)}`;
        case 'platforms':
            return `${rootPath}/platforms${buildQs(params)}`;
        default:
            return `${rootPath}/auto${buildQs(params)}`;
    }
};

export const toDataManager = (params: { id: string }): string =>
    `/s8/data-manager${buildQs(params)}`;

export const toCustomPlatform = (params: { id: string }): string =>
    `/s8/custom-platform${buildQs(params)}`;
export const toTemplatedPlatform = (params: { id: string }): string =>
    `/s8/templated-platform${buildQs(params)}`;
export const toTemplatedPlatformRevision = (params: { id: string }): string =>
    `/s8/templated-platform-revision${buildQs(params)}`;

export const toCustomPlatformRevision = (params: { id: string }, page?: string): string => {
    const rootPath = `/s8/custom-platform-revision`;
    switch (page) {
        case 'settings':
            return `${rootPath}/settings${buildQs(params)}`;
        case 'assets':
            return `${rootPath}/assets${buildQs(params)}`;
        case 'actions':
            return `${rootPath}/actions${buildQs(params)}`;
        case 'data-containers':
            return `${rootPath}/data-containers${buildQs(params)}`;
        case 'events':
            return `${rootPath}/events${buildQs(params)}`;
        default:
            return `${rootPath}/settings${buildQs(params)}`;
    }
};

export const toPlatformRevisionAction = (params: { id: string }): string =>
    `/s8/platform-revision-action${buildQs(params)}`;
export const toPlatformRevisionDataContainer = (params: { id: string }): string =>
    `/s8/platform-revision-data-container${buildQs(params)}`;
export const toPlatformRevisionEvent = (params: { id: string }): string =>
    `/s8/platform-revision-event${buildQs(params)}`;

export const toApp = (params: { id: string; period?: 'realtime' }, page?: string): string => {
    const rootPath = `/s8/app`;
    switch (page) {
        case 'analytics':
            return `${rootPath}/analytics${buildQs(params)}`;
        case 'errors':
            return `${rootPath}/errors${buildQs(params)}`;
        case 'revisions':
            return `${rootPath}/revisions${buildQs(params)}`;
        case 'environments':
            return `${rootPath}/environments${buildQs(params)}`;
        case 'platforms':
            return `${rootPath}/platforms${buildQs(params)}`;
        default:
            return `${rootPath}/auto${buildQs(params)}`;
    }
};

export const toIngestEndpoint = (params: { id: string }, page?: string): string => {
    const rootPath = `/s8/ingest-endpoint`;
    switch (page) {
        case 'analytics':
            return `${rootPath}/analytics${buildQs(params)}`;
        case 'revisions':
            return `${rootPath}/revisions${buildQs(params)}`;
        case 'environments':
            return `${rootPath}/environments${buildQs(params)}`;
        default:
            return `${rootPath}/auto${buildQs(params)}`;
    }
};

export const toIngestEndpointRevision = (params: { id: string }): string =>
    `/s8/ingest-endpoint-revision${buildQs(params)}`;

export const toAppRevision = (params: { id: string }, page?: string): string => {
    const rootPath = `/s8/app-revision`;
    switch (page) {
        case 'tags':
            return `${rootPath}/tags${buildQs(params)}`;
        case 'global-actions':
            return `${rootPath}/global-actions${buildQs(params)}`;
        case 'global-triggers':
            return `${rootPath}/global-triggers${buildQs(params)}`;
        case 'app-platform-revisions':
            return `${rootPath}/app-platform-revisions${buildQs(params)}`;
        default:
            return `${rootPath}/auto${buildQs(params)}`;
    }
};

export const appRevisionFromPath = (path?: string): string | undefined => {
    const rootPath = `/s8/app-revision`;
    switch (path) {
        case `${rootPath}/tags`:
            return 'tags';
        case `${rootPath}/global-actions`:
            return 'global-actions';
        case `${rootPath}/global-triggers`:
            return 'global-triggers';
        case `${rootPath}/app-platform-revisions`:
            return 'app-platform-revisions';
        default:
            return undefined;
    }
};

export const toTag = (params: { id: string }): string => `/s8/tag${buildQs(params)}`;
export const toGlobalTrigger = (params: { id: string }): string =>
    `/s8/global-trigger${buildQs(params)}`;
export const toGlobalAction = (params: { id: string }): string =>
    `/s8/global-action${buildQs(params)}`;
