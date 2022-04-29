import { FC } from 'react';
import { useQuery } from '@apollo/client';
import TagIcon from '../../../components/atoms/Icons/TagIcon';
import PlatformRevisionIcon from '../../../components/atoms/Icons/PlatformRevisionIcon';
import NavAppRevisionQuery from '../../../gql/queries/NavAppRevisionQuery';
import { NavAppRevision } from '../../../gql/generated/NavAppRevision';
import {
    BreadcrumbButtonProps,
    buildAppRevisionButtonProps,
    buildTabButtonProps,
    ButtonAccount,
} from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionItem, SectionProps } from '../../abstractions/Section';
import ActionIcon from '../../../components/atoms/Icons/ActionIcon';
import TriggerIcon from '../../../components/atoms/Icons/TriggerIcon';
import { buildAppRevisionBreadcrumbActions } from '../../../utils/BuildAppRevisionBreadcrumbActions';
import {
    CurrentOrgPermissions,
    extractPermissionsFromOrgUser,
} from '../../../context/OrgUserReducer';
import { SectionKey } from '../../SectionsDetails';
import { useConfigState, useLoggedInState } from '../../../context/AppContext';
import { NextRouter, useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';
import { toAppRevision } from '../../../utils/NavigationPaths';
import { analyticsEnabled } from '../../../utils/AnalyticsUtils';
import { PageMenuButtonProps } from '../../../components/molecules/SideMenuButton';
import { buildAppButtons } from './AppSection';

export const buildAppRevisionTabsMenu = (id: string): PageMenuButtonProps[] => [
    {
        icon: () => <TagIcon />,
        label: 'Tags',
        link: toAppRevision({ id }, 'tags'),
    },
    {
        icon: () => <TriggerIcon />,
        label: 'Global Triggers',
        link: toAppRevision({ id }, 'global-triggers'),
    },
    {
        icon: () => <ActionIcon />,
        label: 'Global Actions',
        link: toAppRevision({ id }, 'global-actions'),
    },
    {
        icon: () => <PlatformRevisionIcon />,
        label: 'Platform Revisions',
        link: toAppRevision({ id }, 'app-platform-revisions'),
    },
];

export const buildAppRevisionButtons = (
    orgs: SectionItem[],
    currentOrg: SectionItem,
    tagManagerAccount: ButtonAccount,
    dataManagerAccount: ButtonAccount,
    apps: SectionItem[],
    currentApp: SectionItem,
    revisions: SectionItem[],
    currentRevision: SectionItem,
    analyticsEnabled: boolean,
    errorTrackingEnabled: boolean,
    router: NextRouter,
    orgPermissions: CurrentOrgPermissions,
    useSignup: boolean,
    forceCurrentEntry?: string,
): BreadcrumbButtonProps[] => [
    ...buildAppButtons(
        orgs,
        currentOrg,
        tagManagerAccount,
        dataManagerAccount,
        apps,
        currentApp,
        analyticsEnabled,
        errorTrackingEnabled,
        router,
        orgPermissions,
        useSignup,
        'Revisions',
    ),
    buildAppRevisionButtonProps(
        router,
        revisions,
        currentRevision.id,
        currentRevision.name,
        forceCurrentEntry === undefined,
    ),
    buildTabButtonProps(router, buildAppRevisionTabsMenu(currentRevision.id), forceCurrentEntry),
];

const AppRevisionSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState, templateInteractions } = useLoggedInState();
    const { ask, dispatchDialogAction, setRefreshCurrentPage } = templateInteractions;
    const { useSignup } = useConfigState();

    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const sectionProps: SectionProps<NavAppRevision> = {
        children,
        sectionKey: SectionKey.appRevision,
        queryResult: useQuery<NavAppRevision>(NavAppRevisionQuery, {
            variables: { id },
        }),
        initContext: (data) => {
            templateInteractions.setSectionHasAnalytics(analyticsEnabled(data.getRevision.app));
        },
        buildButtonsProps: (data, orgPermissions) => {
            return buildAppRevisionButtons(
                data.me.orgs,
                data.getRevision.app.tag_manager_account.org,
                data.getRevision.app.tag_manager_account,
                data.getRevision.app.tag_manager_account.org.data_manager_account,
                data.getRevision.app.tag_manager_account.apps,
                data.getRevision.app,
                data.getRevision.app.revisions,
                data.getRevision,
                analyticsEnabled(data.getRevision.app),
                data.getRevision.app.error_tracking_enabled,
                router,
                orgPermissions,
                useSignup,
            );
        },
        buildMenuItemsProps: () => buildAppRevisionTabsMenu(id),
        extractOrgUserDetails: (data) => data.getRevision.app.tag_manager_account.org,
        buildBreadcrumbActions: (data) =>
            buildAppRevisionBreadcrumbActions(
                id,
                data.getRevision.name,
                router,
                currentOrgPermissions,
                dispatchDialogAction,
                setRefreshCurrentPage,
                ask,
                data.getRevision.locked,
            ),
        accountExpireIn: orgUserState?.tagManagerAccount.trialExpiration ?? undefined,
        accountExpired: orgUserState?.tagManagerAccount.trialExpired ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount.isTrial ?? undefined,
    };

    return <Section<NavAppRevision> {...sectionProps} />;
};

export default AppRevisionSection;
