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
    buildCustomPlatformButtonProps,
    buildOrgButtonProps,
    buildPlatformRevisionButtonProps,
    buildTagManagerButtonProps,
} from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../../abstractions/Section';
import { PlatformType } from '../../../gql/generated/globalTypes';
import { SectionKey } from '../../SectionsDetails';
import { useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';
import { toCustomPlatformRevision } from '../../../utils/NavigationPaths';

const CustomPlatformRevisionSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState } = useLoggedInState();

    const sectionProps: SectionProps<NavPlatformRevision> = {
        children,
        sectionKey: SectionKey.customPlatformRevision,
        queryResult: useQuery<NavPlatformRevision>(NavPlatformRevisionQuery, {
            variables: { id },
        }),
        buildButtonsProps: (data) => [
            buildOrgButtonProps(
                router,
                data.me.orgs,
                data.getPlatformRevision.platform.tag_manager_account.org.id,
                data.getPlatformRevision.platform.tag_manager_account.org.name,
            ),
            buildTagManagerButtonProps(
                router,
                data.getPlatformRevision.platform.tag_manager_account.id,
                data.getPlatformRevision.platform.tag_manager_account.org.data_manager_account
                    ?.id ?? '',
            ),
            buildCustomPlatformButtonProps(
                router,
                data.getPlatformRevision.platform.tag_manager_account.platforms.filter(
                    (_) => _.type === PlatformType.CUSTOM,
                ),
                data.getPlatformRevision.platform.id,
                data.getPlatformRevision.platform.name,
            ),
            buildPlatformRevisionButtonProps(
                router,
                data.getPlatformRevision.platform.platform_revisions,
                id,
                data.getPlatformRevision.name,
                true,
            ),
        ],
        buildMenuItemsProps: () => [
            {
                icon: <SettingIcon />,
                label: 'Settings',
                link: toCustomPlatformRevision({ id }, 'settings'),
            },
            {
                icon: <AssetIcon />,
                label: 'Assets',
                link: toCustomPlatformRevision({ id }, 'assets'),
            },
            {
                icon: <ActionIcon />,
                label: 'Actions',
                link: toCustomPlatformRevision({ id }, 'actions'),
            },
            {
                icon: <DataContainerIcon />,
                label: 'Data Containers',
                link: toCustomPlatformRevision({ id }, 'data-containers'),
            },
            {
                icon: <EventIcon />,
                label: 'Events',
                link: toCustomPlatformRevision({ id }, 'events'),
            },
        ],
        extractOrgUserDetails: (data) => data.getPlatformRevision.platform.tag_manager_account.org,
        accountExpireIn: orgUserState?.tagManagerAccount?.trialExpiration ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount?.isTrial ?? undefined,
    };

    return <Section<NavPlatformRevision> {...sectionProps} />;
};

export default CustomPlatformRevisionSection;
