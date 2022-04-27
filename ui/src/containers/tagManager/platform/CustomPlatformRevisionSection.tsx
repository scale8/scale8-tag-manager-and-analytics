import { FC } from 'react';
import { useQuery } from '@apollo/client';
import NavPlatformRevisionQuery from '../../../gql/queries/NavPlatformRevisionQuery';
import { NavPlatformRevision } from '../../../gql/generated/NavPlatformRevision';
import SettingIcon from '../../../components/atoms/Icons/SettingIcon';
import AssetIcon from '../../../components/atoms/Icons/AssetIcon';
import ActionIcon from '../../../components/atoms/Icons/ActionIcon';
import DataContainerIcon from '../../../components/atoms/Icons/DataContainerIcon';
import EventIcon from '../../../components/atoms/Icons/EventIcon';
import {
    BreadcrumbButtonProps,
    buildPlatformRevisionButtonProps,
    buildTabButtonProps,
    ButtonAccount,
} from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionItem, SectionProps } from '../../abstractions/Section';
import { PlatformType } from '../../../gql/generated/globalTypes';
import { SectionKey } from '../../SectionsDetails';
import { useConfigState, useLoggedInState } from '../../../context/AppContext';
import { NextRouter, useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';
import { toCustomPlatformRevision } from '../../../utils/NavigationPaths';
import { PageMenuButtonProps } from '../../../components/molecules/SideMenuButton';
import { CurrentOrgPermissions } from '../../../context/OrgUserReducer';
import { buildPlatformButtons } from './PlatformSection';

export const buildCustomPlatformRevisionTabsMenu = (id: string): PageMenuButtonProps[] => [
    {
        icon: () => <SettingIcon />,
        label: 'Settings',
        link: toCustomPlatformRevision({ id }, 'settings'),
    },
    {
        icon: () => <AssetIcon />,
        label: 'Assets',
        link: toCustomPlatformRevision({ id }, 'assets'),
    },
    {
        icon: () => <ActionIcon />,
        label: 'Actions',
        link: toCustomPlatformRevision({ id }, 'actions'),
    },
    {
        icon: () => <DataContainerIcon />,
        label: 'Data Containers',
        link: toCustomPlatformRevision({ id }, 'data-containers'),
    },
    {
        icon: () => <EventIcon />,
        label: 'Events',
        link: toCustomPlatformRevision({ id }, 'events'),
    },
];

export const buildCustomPlatformRevisionButtons = (
    orgs: SectionItem[],
    currentOrg: SectionItem,
    tagManagerAccount: ButtonAccount,
    dataManagerAccount: ButtonAccount,
    platforms: SectionItem[],
    currentPlatform: SectionItem,
    platformsRevisions: SectionItem[],
    currentPlatformRevision: SectionItem,
    router: NextRouter,
    orgPermissions: CurrentOrgPermissions,
    useSignup: boolean,
    forceCurrentEntry?: string,
): BreadcrumbButtonProps[] => [
    ...buildPlatformButtons(
        PlatformType.CUSTOM,
        orgs,
        currentOrg,
        tagManagerAccount,
        dataManagerAccount,
        platforms,
        currentPlatform,
        router,
        orgPermissions,
        useSignup,
    ),
    buildPlatformRevisionButtonProps(
        router,
        platformsRevisions,
        currentPlatformRevision.id,
        currentPlatformRevision.name,
        forceCurrentEntry === undefined,
    ),
    buildTabButtonProps(
        router,
        buildCustomPlatformRevisionTabsMenu(currentPlatformRevision.id),
        forceCurrentEntry,
    ),
];

const CustomPlatformRevisionSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState } = useLoggedInState();
    const { useSignup } = useConfigState();

    const sectionProps: SectionProps<NavPlatformRevision> = {
        children,
        sectionKey: SectionKey.customPlatformRevision,
        queryResult: useQuery<NavPlatformRevision>(NavPlatformRevisionQuery, {
            variables: { id },
        }),
        buildButtonsProps: (data, orgPermissions) => {
            return buildCustomPlatformRevisionButtons(
                data.me.orgs,
                data.getPlatformRevision.platform.tag_manager_account.org,
                data.getPlatformRevision.platform.tag_manager_account,
                data.getPlatformRevision.platform.tag_manager_account.org.data_manager_account,
                data.getPlatformRevision.platform.tag_manager_account.platforms.filter(
                    (_) => _.type === PlatformType.CUSTOM,
                ),
                data.getPlatformRevision.platform,
                data.getPlatformRevision.platform.platform_revisions,
                data.getPlatformRevision,
                router,
                orgPermissions,
                useSignup,
            );
        },
        buildMenuItemsProps: () => buildCustomPlatformRevisionTabsMenu(id),
        extractOrgUserDetails: (data) => data.getPlatformRevision.platform.tag_manager_account.org,
        accountExpireIn: orgUserState?.tagManagerAccount.trialExpiration ?? undefined,
        accountExpired: orgUserState?.tagManagerAccount.trialExpired ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount.isTrial ?? undefined,
    };

    return <Section<NavPlatformRevision> {...sectionProps} />;
};

export default CustomPlatformRevisionSection;
