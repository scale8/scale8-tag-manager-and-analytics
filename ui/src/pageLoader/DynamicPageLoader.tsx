import dynamic from 'next/dynamic';
import { FC, useEffect } from 'react';
import { useLoggedInState } from '../context/AppContext';
import { dynamicPages, dynamicPagesSections, pageRequiresId } from './DynamicPages';
import Loader from '../components/organisms/Loader';
import Navigate from '../components/atoms/Next/Navigate';
import { PlatformType } from '../gql/generated/globalTypes';

type PageLoaderProps = {
    page: string;
    params: NodeJS.Dict<string>;
};

export type DynamicPageProps = {
    params: NodeJS.Dict<string>;
};

const OrgSection = dynamic(() => import('../containers/global/OrgSection'));
const ThankYouSection = dynamic(() => import('../containers/global/ThankYouSection'));
const AdminSection = dynamic(() => import('../containers/global/AdminSection'));
const TagManagerSection = dynamic(() => import('../containers/tagManager/TagManagerSection'));
const AppSection = dynamic(() => import('../containers/tagManager/app/AppSection'));
const IngestEndpointSection = dynamic(
    () => import('../containers/dataManager/IngestEndpointSection'),
);
const DataManagerSection = dynamic(() => import('../containers/dataManager/DataManagerSection'));
const IngestEndpointRevisionSection = dynamic(
    () => import('../containers/dataManager/IngestEndpointRevisionSection'),
);
const PlatformSection = dynamic(() => import('../containers/tagManager/platform/PlatformSection'));
const TemplatedPlatformRevisionSection = dynamic(
    () => import('../containers/tagManager/platform/TemplatedPlatformRevisionSection'),
);
const CustomPlatformRevisionSection = dynamic(
    () => import('../containers/tagManager/platform/CustomPlatformRevisionSection'),
);
const PlatformActionSection = dynamic(
    () => import('../containers/tagManager/platform/PlatformActionSection'),
);
const PlatformEventSection = dynamic(
    () => import('../containers/tagManager/platform/PlatformEventSection'),
);
const PlatformDataContainerSection = dynamic(
    () => import('../containers/tagManager/platform/PlatformDataContainerSection'),
);
const AppRevisionSection = dynamic(() => import('../containers/tagManager/app/AppRevisionSection'));
const GlobalActionSection = dynamic(
    () => import('../containers/tagManager/app/GlobalActionSection'),
);
const TagSection = dynamic(() => import('../containers/tagManager/app/TagSection'));
const GlobalTriggerSection = dynamic(
    () => import('../containers/tagManager/app/GlobalTriggerSection'),
);

const OrgsPage = dynamic(() => import('../dynamicPages/orgs'));
const SelectOrgPage = dynamic(() => import('../dynamicPages/select-org'));
const OrgDashboardPage = dynamic(() => import('../dynamicPages/org/dashboard'));
const OrgUsersPage = dynamic(() => import('../dynamicPages/org/users'));
const UserInvitesPage = dynamic(() => import('../dynamicPages/org/user-invites'));
const OrgSettingsPage = dynamic(() => import('../dynamicPages/org/settings'));
const OrgThankYouPage = dynamic(() => import('../dynamicPages/org/thank-you'));
const AdminDashboardPage = dynamic(() => import('../dynamicPages/admin/dashboard'));
const AdminSignUpApprovalPage = dynamic(() => import('../dynamicPages/admin/signup-approval'));
const AppsPage = dynamic(() => import('../dynamicPages/tag-manager/apps'));
const TagManagerAuto = dynamic(() => import('../dynamicPages/tag-manager/auto'));
const PlatformsPage = dynamic(() => import('../dynamicPages/tag-manager/platforms'));
const AppAnalyticsPage = dynamic(() => import('../dynamicPages/app/analytics'));
const AppErrorsPage = dynamic(() => import('../dynamicPages/app/errors'));
const AppAuto = dynamic(() => import('../dynamicPages/app/auto'));
const AppEnvironmentsPage = dynamic(() => import('../dynamicPages/app/environments'));
const AppPlatformsPage = dynamic(() => import('../dynamicPages/app/platforms'));
const AppRevisionsPage = dynamic(() => import('../dynamicPages/app/revisions'));
const IngestEndpointAnalyticsPage = dynamic(
    () => import('../dynamicPages/ingest-endpoint/analytics'),
);
const IngestEndpointAuto = dynamic(() => import('../dynamicPages/ingest-endpoint/auto'));
const IngestEndpointEnvironmentsPage = dynamic(
    () => import('../dynamicPages/ingest-endpoint/environments'),
);
const IngestEndpointRevisionsPage = dynamic(
    () => import('../dynamicPages/ingest-endpoint/revisions'),
);
const IngestEndpointsPage = dynamic(() => import('../dynamicPages/data-manager'));
const TemplatedActionsPage = dynamic(() => import('../dynamicPages/templated-platform-revision'));
const PlatformActionsPage = dynamic(
    () => import('../dynamicPages/custom-platform-revision/actions'),
);
const PlatformAssetsPage = dynamic(() => import('../dynamicPages/custom-platform-revision/assets'));
const PlatformDataContainersPage = dynamic(
    () => import('../dynamicPages/custom-platform-revision/data-containers'),
);
const PlatformEventsPage = dynamic(() => import('../dynamicPages/custom-platform-revision/events'));
const PlatformSettingsPage = dynamic(
    () => import('../dynamicPages/custom-platform-revision/settings'),
);
const IngestEndpointDataMapsPage = dynamic(
    () => import('../dynamicPages/ingest-endpoint-revision'),
);
const CustomPlatformPage = dynamic(() => import('../dynamicPages/custom-platform'));
const TemplatedPlatformPage = dynamic(() => import('../dynamicPages/templated-platform'));
const PlatformRevisionAction = dynamic(() => import('../dynamicPages/platform-revision-action'));
const PlatformDataContainerDataMapsPage = dynamic(
    () => import('../dynamicPages/platform-revision-data-container'),
);
const PlatformEventDataMapsPage = dynamic(() => import('../dynamicPages/platform-revision-event'));
const AppRevisionAuto = dynamic(() => import('../dynamicPages/app-revision/auto'));
const GlobalActionsPage = dynamic(() => import('../dynamicPages/app-revision/global-actions'));
const GlobalTriggersPage = dynamic(() => import('../dynamicPages/app-revision/global-triggers'));
const TagsPage = dynamic(() => import('../dynamicPages/app-revision/tags'));
const AppPlatformRevisionsPage = dynamic(
    () => import('../dynamicPages/app-revision/app-platform-revisions'),
);
const RulesPage = dynamic(() => import('../dynamicPages/tag'));
const GlobalActionPage = dynamic(() => import('../dynamicPages/global-action'));
const GlobalTriggerPage = dynamic(() => import('../dynamicPages/global-trigger'));

const PageSelect: FC<PageLoaderProps> = (props: PageLoaderProps) => {
    const { page, params } = props;

    switch (page) {
        case dynamicPages.orgs:
            return <OrgsPage params={params} />;
        case dynamicPages.selectOrg:
            return <SelectOrgPage params={params} />;
        case dynamicPages.orgDashboard:
            return <OrgDashboardPage params={params} />;
        case dynamicPages.orgUsers:
            return <OrgUsersPage params={params} />;
        case dynamicPages.orgInvites:
            return <UserInvitesPage params={params} />;
        case dynamicPages.orgSettings:
            return <OrgSettingsPage params={params} />;
        case dynamicPages.orgThankYou:
            return <OrgThankYouPage params={params} />;
        case dynamicPages.adminDashboard:
            return <AdminDashboardPage params={params} />;
        case dynamicPages.adminSignupApproval:
            return <AdminSignUpApprovalPage params={params} />;

        case dynamicPages.tmApps:
            return <AppsPage params={params} />;
        case dynamicPages.tmPlatforms:
            return <PlatformsPage params={params} />;
        case dynamicPages.tmAuto:
            return <TagManagerAuto params={params} />;

        case dynamicPages.appAnalytics:
            return <AppAnalyticsPage params={params} />;
        case dynamicPages.appErrors:
            return <AppErrorsPage params={params} />;
        case dynamicPages.appRevisions:
            return <AppRevisionsPage params={params} />;
        case dynamicPages.appEnvironments:
            return <AppEnvironmentsPage params={params} />;
        case dynamicPages.appPlatforms:
            return <AppPlatformsPage params={params} />;
        case dynamicPages.appAuto:
            return <AppAuto params={params} />;

        case dynamicPages.ingestEndpointAnalytics:
            return <IngestEndpointAnalyticsPage params={params} />;
        case dynamicPages.ingestEndpointRevisions:
            return <IngestEndpointRevisionsPage params={params} />;
        case dynamicPages.ingestEndpointEnvironments:
            return <IngestEndpointEnvironmentsPage params={params} />;
        case dynamicPages.ingestEndpointAuto:
            return <IngestEndpointAuto params={params} />;

        case dynamicPages.dataManager:
            return <IngestEndpointsPage params={params} />;

        case dynamicPages.ingestEndpointRevision:
            return <IngestEndpointDataMapsPage params={params} />;

        case dynamicPages.customPlatform:
            return <CustomPlatformPage params={params} />;

        case dynamicPages.templatedPlatform:
            return <TemplatedPlatformPage params={params} />;

        case dynamicPages.templatedPlatformRevision:
            return <TemplatedActionsPage params={params} />;

        case dynamicPages.customPlatformActions:
            return <PlatformActionsPage params={params} />;
        case dynamicPages.customPlatformAssets:
            return <PlatformAssetsPage params={params} />;
        case dynamicPages.customPlatformDataContainers:
            return <PlatformDataContainersPage params={params} />;
        case dynamicPages.customPlatformEvents:
            return <PlatformEventsPage params={params} />;
        case dynamicPages.customPlatformSettings:
            return <PlatformSettingsPage params={params} />;

        case dynamicPages.platformRevisionAction:
            return <PlatformRevisionAction params={params} />;
        case dynamicPages.platformRevisionDataContainer:
            return <PlatformDataContainerDataMapsPage params={params} />;
        case dynamicPages.platformRevisionEvent:
            return <PlatformEventDataMapsPage params={params} />;

        case dynamicPages.appRevisionTags:
            return <TagsPage params={params} />;
        case dynamicPages.appRevisionGlobalActions:
            return <GlobalActionsPage params={params} />;
        case dynamicPages.appRevisionGlobalTriggers:
            return <GlobalTriggersPage params={params} />;
        case dynamicPages.appRevisionAppPlatformRevisions:
            return <AppPlatformRevisionsPage params={params} />;
        case dynamicPages.appRevisionAuto:
            return <AppRevisionAuto params={params} />;

        case dynamicPages.tag:
            return <RulesPage params={params} />;

        case dynamicPages.globalTrigger:
            return <GlobalTriggerPage params={params} />;

        case dynamicPages.globalAction:
            return <GlobalActionPage params={params} />;

        default:
            return <Navigate to="/404" />;
    }
};

const DynamicPageLoader: FC<PageLoaderProps> = (props: PageLoaderProps) => {
    const { page, params } = props;
    const { id: paramsId } = params;

    const id = paramsId ?? '';

    const { templateInteractions, teleport } = useLoggedInState();
    const { dispatchSectionAction } = templateInteractions;

    useEffect(() => {
        dispatchSectionAction({
            type: 'page',
            payload: page,
        });
        if (dynamicPagesSections.root.includes(page)) {
            teleport('breadcrumb', <></>);
            teleport('side', <></>);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    if (pageRequiresId(page) && paramsId === undefined) {
        return <Loader />;
    }

    if (dynamicPagesSections.admin.includes(page)) {
        return (
            <AdminSection>
                <PageSelect {...props} />
            </AdminSection>
        );
    }

    if (dynamicPagesSections.orgs.includes(page)) {
        return (
            <OrgSection id={id}>
                <PageSelect {...props} />
            </OrgSection>
        );
    }

    if (dynamicPagesSections.orgsThankYou.includes(page)) {
        return (
            <ThankYouSection id={id}>
                <PageSelect {...props} />
            </ThankYouSection>
        );
    }

    if (dynamicPagesSections.tagManager.includes(page)) {
        return (
            <TagManagerSection id={id}>
                <PageSelect {...props} />
            </TagManagerSection>
        );
    }

    if (dynamicPagesSections.app.includes(page)) {
        return (
            <AppSection id={id}>
                <PageSelect {...props} />
            </AppSection>
        );
    }

    if (dynamicPagesSections.ingestEndpoint.includes(page)) {
        return (
            <IngestEndpointSection id={id}>
                <PageSelect {...props} />
            </IngestEndpointSection>
        );
    }

    if (dynamicPagesSections.dataManager.includes(page)) {
        return (
            <DataManagerSection id={id}>
                <PageSelect {...props} />
            </DataManagerSection>
        );
    }

    if (dynamicPagesSections.ingestEndpointRevision.includes(page)) {
        return (
            <IngestEndpointRevisionSection id={id}>
                <PageSelect {...props} />
            </IngestEndpointRevisionSection>
        );
    }

    if (dynamicPagesSections.customPlatform.includes(page)) {
        return (
            <PlatformSection type={PlatformType.CUSTOM} id={id}>
                <PageSelect {...props} />
            </PlatformSection>
        );
    }

    if (dynamicPagesSections.templatedPlatform.includes(page)) {
        return (
            <PlatformSection type={PlatformType.TEMPLATED} id={id}>
                <PageSelect {...props} />
            </PlatformSection>
        );
    }

    if (dynamicPagesSections.templatedPlatformRevision.includes(page)) {
        return (
            <TemplatedPlatformRevisionSection id={id}>
                <PageSelect {...props} />
            </TemplatedPlatformRevisionSection>
        );
    }

    if (dynamicPagesSections.customPlatformRevision.includes(page)) {
        return (
            <CustomPlatformRevisionSection id={id}>
                <PageSelect {...props} />
            </CustomPlatformRevisionSection>
        );
    }

    if (dynamicPagesSections.platformRevisionAction.includes(page)) {
        return (
            <PlatformActionSection id={id}>
                <PageSelect {...props} />
            </PlatformActionSection>
        );
    }

    if (dynamicPagesSections.platformRevisionDataContainer.includes(page)) {
        return (
            <PlatformDataContainerSection id={id}>
                <PageSelect {...props} />
            </PlatformDataContainerSection>
        );
    }

    if (dynamicPagesSections.platformRevisionEvent.includes(page)) {
        return (
            <PlatformEventSection id={id}>
                <PageSelect {...props} />
            </PlatformEventSection>
        );
    }

    if (dynamicPagesSections.appRevision.includes(page)) {
        return (
            <AppRevisionSection id={id}>
                <PageSelect {...props} />
            </AppRevisionSection>
        );
    }

    if (dynamicPagesSections.tag.includes(page)) {
        return (
            <TagSection id={id}>
                <PageSelect {...props} />
            </TagSection>
        );
    }

    if (dynamicPagesSections.globalTrigger.includes(page)) {
        return (
            <GlobalTriggerSection id={id}>
                <PageSelect {...props} />
            </GlobalTriggerSection>
        );
    }

    if (dynamicPagesSections.globalAction.includes(page)) {
        return (
            <GlobalActionSection id={id}>
                <PageSelect {...props} />
            </GlobalActionSection>
        );
    }

    return <PageSelect {...props} />;
};

export default DynamicPageLoader;
