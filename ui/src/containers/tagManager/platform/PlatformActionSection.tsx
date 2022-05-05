import { FC } from 'react';
import { useQuery } from '@apollo/client';
import NavPlatformRevisionActionQuery from '../../../gql/queries/NavPlatformRevisionActionQuery';
import { NavPlatformRevisionAction } from '../../../gql/generated/NavPlatformRevisionAction';
import { buildPlatformRevisionActionButtonProps } from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../../abstractions/Section';
import { PlatformType } from '../../../gql/generated/globalTypes';
import { SectionKey } from '../../SectionsDetails';
import { useConfigState, useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';
import { buildCustomPlatformRevisionButtons } from './CustomPlatformRevisionSection';

const PlatformActionSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState } = useLoggedInState();
    const { useSignup } = useConfigState();

    const sectionProps: SectionProps<NavPlatformRevisionAction> = {
        children,
        sectionKey: SectionKey.platformAction,
        queryResult: useQuery<NavPlatformRevisionAction>(NavPlatformRevisionActionQuery, {
            variables: { id },
        }),
        buildButtonsProps: (data, orgPermissions) => [
            ...buildCustomPlatformRevisionButtons(
                data.me.orgs,
                data.getPlatformAction.platform_revision.platform.tag_manager_account.org,
                data.getPlatformAction.platform_revision.platform.tag_manager_account,
                data.getPlatformAction.platform_revision.platform.tag_manager_account.org
                    .data_manager_account,
                data.getPlatformAction.platform_revision.platform.tag_manager_account.platforms.filter(
                    (_) => _.type === PlatformType.CUSTOM,
                ),
                data.getPlatformAction.platform_revision.platform,
                data.getPlatformAction.platform_revision.platform.platform_revisions,
                data.getPlatformAction.platform_revision,
                router,
                orgPermissions,
                useSignup,
                'Actions',
            ),
            buildPlatformRevisionActionButtonProps(
                router,
                data.getPlatformAction.platform_revision.platform_actions,
                id,
                data.getPlatformAction.name,
                true,
            ),
        ],
        buildMenuItemsProps: () => [],
        extractOrgUserDetails: (data) =>
            data.getPlatformAction.platform_revision.platform.tag_manager_account.org,
        accountExpireIn: orgUserState?.tagManagerAccount.trialExpiration ?? undefined,
        accountExpired: orgUserState?.tagManagerAccount.trialExpired ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount.isTrial ?? undefined,
    };

    return <Section<NavPlatformRevisionAction> {...sectionProps} />;
};

export default PlatformActionSection;
