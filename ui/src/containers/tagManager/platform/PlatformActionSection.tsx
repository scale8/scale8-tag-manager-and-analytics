import { FC } from 'react';
import { useQuery } from '@apollo/client';
import NavPlatformRevisionActionQuery from '../../../gql/queries/NavPlatformRevisionActionQuery';
import { NavPlatformRevisionAction } from '../../../gql/generated/NavPlatformRevisionAction';
import {
    buildCustomPlatformButtonProps,
    buildOrgButtonProps,
    buildPlatformRevisionActionButtonProps,
    buildPlatformRevisionButtonProps,
    buildTagManagerButtonProps,
} from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../../abstractions/Section';
import { PlatformType } from '../../../gql/generated/globalTypes';
import { SectionKey } from '../../SectionsDetails';
import { useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';

const PlatformActionSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState } = useLoggedInState();

    const sectionProps: SectionProps<NavPlatformRevisionAction> = {
        children,
        sectionKey: SectionKey.platformAction,
        queryResult: useQuery<NavPlatformRevisionAction>(NavPlatformRevisionActionQuery, {
            variables: { id },
        }),
        buildButtonsProps: (data) => [
            buildOrgButtonProps(
                router,
                data.me.orgs,
                data.getPlatformAction.platform_revision.platform.tag_manager_account.org.id,
                data.getPlatformAction.platform_revision.platform.tag_manager_account.org.name,
            ),
            buildTagManagerButtonProps(
                router,
                data.getPlatformAction.platform_revision.platform.tag_manager_account.id,
                data.getPlatformAction.platform_revision.platform.tag_manager_account.org
                    .data_manager_account?.id ?? '',
            ),
            buildCustomPlatformButtonProps(
                router,
                data.getPlatformAction.platform_revision.platform.tag_manager_account.platforms.filter(
                    (_) => _.type === PlatformType.CUSTOM,
                ),
                data.getPlatformAction.platform_revision.platform.id,
                data.getPlatformAction.platform_revision.platform.name,
            ),
            buildPlatformRevisionButtonProps(
                router,
                data.getPlatformAction.platform_revision.platform.platform_revisions,
                data.getPlatformAction.platform_revision.id,
                data.getPlatformAction.platform_revision.name,
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
        accountExpireIn: orgUserState?.tagManagerAccount?.trialExpiration ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount?.isTrial ?? undefined,
    };

    return <Section<NavPlatformRevisionAction> {...sectionProps} />;
};

export default PlatformActionSection;
