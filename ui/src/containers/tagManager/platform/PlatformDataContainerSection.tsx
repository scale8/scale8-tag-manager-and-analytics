import { FC } from 'react';
import { useQuery } from '@apollo/client';

import NavPlatformRevisionDataContainerQuery from '../../../gql/queries/NavPlatformRevisionDataContainerQuery';
import { NavPlatformRevisionDataContainer } from '../../../gql/generated/NavPlatformRevisionDataContainer';
import {
    buildCustomPlatformButtonProps,
    buildOrgButtonProps,
    buildPlatformRevisionButtonProps,
    buildPlatformRevisionDataContainerButtonProps,
    buildTagManagerButtonProps,
} from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../../abstractions/Section';
import { PlatformType } from '../../../gql/generated/globalTypes';
import { SectionKey } from '../../SectionsDetails';
import { useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';

const PlatformDataContainerSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState } = useLoggedInState();

    const sectionProps: SectionProps<NavPlatformRevisionDataContainer> = {
        children,
        sectionKey: SectionKey.platformDataContainer,
        queryResult: useQuery<NavPlatformRevisionDataContainer>(
            NavPlatformRevisionDataContainerQuery,
            {
                variables: { id },
            },
        ),
        buildButtonsProps: (data) => [
            buildOrgButtonProps(
                router,
                data.me.orgs,
                data.getPlatformDataContainer.platform_revision.platform.tag_manager_account.org.id,
                data.getPlatformDataContainer.platform_revision.platform.tag_manager_account.org
                    .name,
            ),
            buildTagManagerButtonProps(
                router,
                data.getPlatformDataContainer.platform_revision.platform.tag_manager_account.id,
                data.getPlatformDataContainer.platform_revision.platform.tag_manager_account.org
                    .data_manager_account?.id ?? '',
            ),
            buildCustomPlatformButtonProps(
                router,
                data.getPlatformDataContainer.platform_revision.platform.tag_manager_account.platforms.filter(
                    (_) => _.type === PlatformType.CUSTOM,
                ),
                data.getPlatformDataContainer.platform_revision.platform.id,
                data.getPlatformDataContainer.platform_revision.platform.name,
            ),
            buildPlatformRevisionButtonProps(
                router,
                data.getPlatformDataContainer.platform_revision.platform.platform_revisions,
                data.getPlatformDataContainer.platform_revision.id,
                data.getPlatformDataContainer.platform_revision.name,
            ),
            buildPlatformRevisionDataContainerButtonProps(
                router,
                data.getPlatformDataContainer.platform_revision.platform_data_containers,
                id,
                data.getPlatformDataContainer.name,
                true,
            ),
        ],
        buildMenuItemsProps: () => [],
        extractOrgUserDetails: (data) =>
            data.getPlatformDataContainer.platform_revision.platform.tag_manager_account.org,
        accountExpireIn: orgUserState?.tagManagerAccount?.trialExpiration ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount?.isTrial ?? undefined,
    };

    return <Section<NavPlatformRevisionDataContainer> {...sectionProps} />;
};

export default PlatformDataContainerSection;
