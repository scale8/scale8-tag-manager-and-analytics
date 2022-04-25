import { FC } from 'react';
import { useQuery } from '@apollo/client';

import NavPlatformRevisionDataContainerQuery from '../../../gql/queries/NavPlatformRevisionDataContainerQuery';
import { NavPlatformRevisionDataContainer } from '../../../gql/generated/NavPlatformRevisionDataContainer';
import { buildPlatformRevisionDataContainerButtonProps } from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../../abstractions/Section';
import { PlatformType } from '../../../gql/generated/globalTypes';
import { SectionKey } from '../../SectionsDetails';
import { useConfigState, useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';
import { buildCustomPlatformRevisionButtons } from './CustomPlatformRevisionSection';

const PlatformDataContainerSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState } = useLoggedInState();
    const { useSignup } = useConfigState();

    const sectionProps: SectionProps<NavPlatformRevisionDataContainer> = {
        children,
        sectionKey: SectionKey.platformDataContainer,
        queryResult: useQuery<NavPlatformRevisionDataContainer>(
            NavPlatformRevisionDataContainerQuery,
            {
                variables: { id },
            },
        ),
        buildButtonsProps: (data, orgPermissions) => [
            ...buildCustomPlatformRevisionButtons(
                data.me.orgs,
                data.getPlatformDataContainer.platform_revision.platform.tag_manager_account.org,
                data.getPlatformDataContainer.platform_revision.platform.tag_manager_account,
                data.getPlatformDataContainer.platform_revision.platform.tag_manager_account.org
                    .data_manager_account,
                data.getPlatformDataContainer.platform_revision.platform.tag_manager_account.platforms.filter(
                    (_) => _.type === PlatformType.CUSTOM,
                ),
                data.getPlatformDataContainer.platform_revision.platform,
                data.getPlatformDataContainer.platform_revision.platform.platform_revisions,
                data.getPlatformDataContainer.platform_revision,
                router,
                orgPermissions,
                useSignup,
                'Data Containers',
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
