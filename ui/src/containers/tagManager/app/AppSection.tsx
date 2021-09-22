import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { NavApp } from '../../../gql/generated/NavApp';
import NavAppQuery from '../../../gql/queries/NavAppQuery';
import RevisionIcon from '../../../components/atoms/Icons/RevisionIcon';
import EnvironmentIcon from '../../../components/atoms/Icons/EnvironmentIcon';
import PlatformIcon from '../../../components/atoms/Icons/PlatformIcon';
import {
    buildAppButtonProps,
    buildOrgButtonProps,
    buildTagManagerButtonProps,
} from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../../abstractions/Section';
import AppAnalyticsIcon from '../../../components/atoms/Icons/AppAnalyticsIcon';
import { SectionKey } from '../../SectionsDetails';
import { useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';
import { toApp } from '../../../utils/NavigationPaths';
import { analyticsEnabled } from '../../../utils/AnalyticsUtils';
import { SideMenuButtonProps } from '../../../components/molecules/SideMenuButton';

const AppSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState, templateInteractions } = useLoggedInState();

    const sectionProps: SectionProps<NavApp> = {
        children,
        sectionKey: SectionKey.app,
        queryResult: useQuery<NavApp>(NavAppQuery, {
            variables: { id },
        }),
        initContext: (data) => {
            templateInteractions.setSectionHasAnalytics(analyticsEnabled(data.getApp));
        },
        buildButtonsProps: (data) => [
            buildOrgButtonProps(
                router,
                data.me.orgs,
                data.getApp.tag_manager_account.org.id,
                data.getApp.tag_manager_account.org.name,
            ),
            buildTagManagerButtonProps(
                router,
                data.getApp.tag_manager_account.id,
                data.getApp.tag_manager_account.org.data_manager_account?.id ?? '',
            ),
            buildAppButtonProps(
                router,
                data.getApp.tag_manager_account.apps,
                id,
                data.getApp.name,
                true,
            ),
        ],
        buildMenuItemsProps: (_, data) => [
            ...((analyticsEnabled(data.getApp)
                ? [
                      {
                          icon: <AppAnalyticsIcon />,
                          label: 'Analytics',
                          link: toApp({ id }, 'analytics'),
                      },
                  ]
                : []) as SideMenuButtonProps[]),
            {
                icon: <RevisionIcon />,
                label: 'Revisions',
                link: toApp({ id }, 'revisions'),
            },
            {
                icon: <EnvironmentIcon />,
                label: 'Environments',
                link: toApp({ id }, 'environments'),
            },
            {
                icon: <PlatformIcon />,
                label: 'Installed Platforms',
                link: toApp({ id }, 'platforms'),
            },
        ],
        extractOrgUserDetails: (data) => data.getApp.tag_manager_account.org,
        accountExpireIn: orgUserState?.tagManagerAccount?.trialExpiration ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount?.isTrial ?? undefined,
    };

    return <Section<NavApp> {...sectionProps} />;
};

export default AppSection;
