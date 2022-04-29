import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { NavApp } from '../../../gql/generated/NavApp';
import NavAppQuery from '../../../gql/queries/NavAppQuery';
import RevisionIcon from '../../../components/atoms/Icons/RevisionIcon';
import EnvironmentIcon from '../../../components/atoms/Icons/EnvironmentIcon';
import PlatformIcon from '../../../components/atoms/Icons/PlatformIcon';
import {
    BreadcrumbButtonProps,
    buildAppButtonProps,
    buildTabButtonProps,
    ButtonAccount,
} from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionItem, SectionProps } from '../../abstractions/Section';
import AppAnalyticsIcon from '../../../components/atoms/Icons/AppAnalyticsIcon';
import { SectionKey } from '../../SectionsDetails';
import { useConfigState, useLoggedInState } from '../../../context/AppContext';
import { NextRouter, useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';
import { toApp } from '../../../utils/NavigationPaths';
import { analyticsEnabled } from '../../../utils/AnalyticsUtils';
import { PageMenuButtonProps } from '../../../components/molecules/SideMenuButton';
import AppErrorsIcon from '../../../components/atoms/Icons/AppErrorsIcon';
import { CurrentOrgPermissions } from '../../../context/OrgUserReducer';
import { buildTagManagerButtons } from '../TagManagerSection';

export const buildAppTabsMenu = (
    id: string,
    analyticsEnabled: boolean,
    errorTrackingEnabled: boolean,
): PageMenuButtonProps[] => [
    ...((analyticsEnabled
        ? [
              {
                  icon: () => <AppAnalyticsIcon />,
                  label: 'Analytics',
                  link: toApp({ id }, 'analytics'),
              },
          ]
        : []) as PageMenuButtonProps[]),

    ...((errorTrackingEnabled
        ? [
              {
                  icon: () => <AppErrorsIcon />,
                  label: 'Errors',
                  link: toApp({ id }, 'errors'),
              },
          ]
        : []) as PageMenuButtonProps[]),
    {
        icon: () => <RevisionIcon />,
        label: 'Revisions',
        link: toApp({ id }, 'revisions'),
    },
    {
        icon: () => <EnvironmentIcon />,
        label: 'Environments',
        link: toApp({ id }, 'environments'),
    },
    {
        icon: () => <PlatformIcon />,
        label: 'Installed Platforms',
        link: toApp({ id }, 'platforms'),
    },
];

export const buildAppButtons = (
    orgs: SectionItem[],
    currentOrg: SectionItem,
    tagManagerAccount: ButtonAccount,
    dataManagerAccount: ButtonAccount,
    apps: SectionItem[],
    currentApp: SectionItem,
    analyticsEnabled: boolean,
    errorTrackingEnabled: boolean,
    router: NextRouter,
    orgPermissions: CurrentOrgPermissions,
    useSignup: boolean,
    forceCurrentEntry?: string,
): BreadcrumbButtonProps[] => [
    ...buildTagManagerButtons(
        orgs,
        currentOrg,
        tagManagerAccount,
        dataManagerAccount,
        router,
        orgPermissions,
        useSignup,
        'Applications',
    ),
    buildAppButtonProps(
        router,
        apps,
        currentApp.id,
        currentApp.name,
        forceCurrentEntry === undefined,
    ),
    buildTabButtonProps(
        router,
        buildAppTabsMenu(currentApp.id, analyticsEnabled, errorTrackingEnabled),
        forceCurrentEntry,
    ),
];

const AppSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState, templateInteractions } = useLoggedInState();
    const { useSignup } = useConfigState();

    const sectionProps: SectionProps<NavApp> = {
        children,
        sectionKey: SectionKey.app,
        queryResult: useQuery<NavApp>(NavAppQuery, {
            variables: { id },
        }),
        initContext: (data) => {
            templateInteractions.setSectionHasAnalytics(analyticsEnabled(data.getApp));
        },
        buildButtonsProps: (data, orgPermissions) => {
            return buildAppButtons(
                data.me.orgs,
                data.getApp.tag_manager_account.org,
                data.getApp.tag_manager_account,
                data.getApp.tag_manager_account.org.data_manager_account,
                data.getApp.tag_manager_account.apps,
                data.getApp,
                analyticsEnabled(data.getApp),
                data.getApp.error_tracking_enabled,
                router,
                orgPermissions,
                useSignup,
            );
        },
        buildMenuItemsProps: (data) => {
            return buildAppTabsMenu(
                id,
                analyticsEnabled(data.getApp),
                data.getApp.error_tracking_enabled,
            );
        },
        extractOrgUserDetails: (data) => data.getApp.tag_manager_account.org,
        accountExpireIn: orgUserState?.tagManagerAccount.trialExpiration ?? undefined,
        accountExpired: orgUserState?.tagManagerAccount.trialExpired ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount.isTrial ?? undefined,
    };

    return <Section<NavApp> {...sectionProps} />;
};

export default AppSection;
