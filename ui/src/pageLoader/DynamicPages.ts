export const dynamicPages = {
    orgs: 'orgs',
    selectOrg: 'select-org',

    adminDashboard: 'admin/dashboard',
    adminSignupApproval: 'admin/signup-approval',

    orgDashboard: 'org/dashboard',
    orgSettings: 'org/settings',
    orgInvites: 'org/user-invites',
    orgUsers: 'org/users',
    orgThankYou: 'org/thank-you',

    tmApps: 'tag-manager/apps',
    tmPlatforms: 'tag-manager/platforms',
    tmAuto: 'tag-manager/auto',

    appAnalytics: 'app/analytics',
    appRevisions: 'app/revisions',
    appEnvironments: 'app/environments',
    appPlatforms: 'app/platforms',
    appAuto: 'app/auto',

    ingestEndpointAnalytics: 'ingest-endpoint/analytics',
    ingestEndpointRevisions: 'ingest-endpoint/revisions',
    ingestEndpointEnvironments: 'ingest-endpoint/environments',
    ingestEndpointAuto: 'ingest-endpoint/auto',

    dataManager: 'data-manager',

    ingestEndpointRevision: 'ingest-endpoint-revision',

    platformRevisions: 'platform-revisions',

    customPlatform: 'custom-platform',
    templatedPlatform: 'templated-platform',

    templatedPlatformRevision: 'templated-platform-revision',

    customPlatformActions: 'custom-platform-revision/actions',
    customPlatformAssets: 'custom-platform-revision/assets',
    customPlatformDataContainers: 'custom-platform-revision/data-containers',
    customPlatformEvents: 'custom-platform-revision/events',
    customPlatformSettings: 'custom-platform-revision/settings',

    platformRevisionAction: 'platform-revision-action',
    platformRevisionDataContainer: 'platform-revision-data-container',
    platformRevisionEvent: 'platform-revision-event',

    appRevisionTags: 'app-revision/tags',
    appRevisionGlobalActions: 'app-revision/global-actions',
    appRevisionGlobalTriggers: 'app-revision/global-triggers',
    appRevisionAppPlatformRevisions: 'app-revision/app-platform-revisions',
    appRevisionAuto: 'app-revision/auto',

    tag: 'tag',

    globalTrigger: 'global-trigger',

    globalAction: 'global-action',
};

export const dynamicPagesSections = {
    root: [dynamicPages.orgs, dynamicPages.selectOrg],
    admin: [dynamicPages.adminDashboard, dynamicPages.adminSignupApproval],
    orgs: [
        dynamicPages.orgDashboard,
        dynamicPages.orgSettings,
        dynamicPages.orgInvites,
        dynamicPages.orgUsers,
    ],
    orgsThankYou: [dynamicPages.orgThankYou],
    tagManager: [dynamicPages.tmApps, dynamicPages.tmPlatforms, dynamicPages.tmAuto],
    app: [
        dynamicPages.appAnalytics,
        dynamicPages.appRevisions,
        dynamicPages.appEnvironments,
        dynamicPages.appPlatforms,
        dynamicPages.appAuto,
    ],
    ingestEndpoint: [
        dynamicPages.ingestEndpointAnalytics,
        dynamicPages.ingestEndpointRevisions,
        dynamicPages.ingestEndpointEnvironments,
        dynamicPages.ingestEndpointAuto,
    ],
    dataManager: [dynamicPages.dataManager],
    ingestEndpointRevision: [dynamicPages.ingestEndpointRevision],
    customPlatform: [dynamicPages.customPlatform],
    templatedPlatform: [dynamicPages.templatedPlatform],
    templatedPlatformRevision: [dynamicPages.templatedPlatformRevision],

    customPlatformRevision: [
        dynamicPages.customPlatformActions,
        dynamicPages.customPlatformAssets,
        dynamicPages.customPlatformDataContainers,
        dynamicPages.customPlatformEvents,
        dynamicPages.customPlatformSettings,
    ],

    platformRevisionAction: [dynamicPages.platformRevisionAction],
    platformRevisionDataContainer: [dynamicPages.platformRevisionDataContainer],
    platformRevisionEvent: [dynamicPages.platformRevisionEvent],

    appRevision: [
        dynamicPages.appRevisionTags,
        dynamicPages.appRevisionGlobalActions,
        dynamicPages.appRevisionGlobalTriggers,
        dynamicPages.appRevisionAppPlatformRevisions,
        dynamicPages.appRevisionAuto,
    ],

    tag: [dynamicPages.tag],
    globalTrigger: [dynamicPages.globalTrigger],
    globalAction: [dynamicPages.globalAction],
};

export const pageRequiresId = (page: string): boolean => {
    return !dynamicPagesSections.root.includes(page) && !dynamicPagesSections.admin.includes(page);
};
