import { FC } from 'react';
import { useQuery } from '@apollo/client';
import NavPlatformRevisionEventQuery from '../../../gql/queries/NavPlatformRevisionEventQuery';
import { NavPlatformRevisionEvent } from '../../../gql/generated/NavPlatformRevisionEvent';
import { buildPlatformRevisionEventButtonProps } from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../../abstractions/Section';
import { PlatformType } from '../../../gql/generated/globalTypes';
import { SectionKey } from '../../SectionsDetails';
import { useConfigState, useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';
import { buildCustomPlatformRevisionButtons } from './CustomPlatformRevisionSection';

const PlatformEventSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState } = useLoggedInState();
    const { useSignup } = useConfigState();

    const sectionProps: SectionProps<NavPlatformRevisionEvent> = {
        children,
        sectionKey: SectionKey.platformEvent,
        queryResult: useQuery<NavPlatformRevisionEvent>(NavPlatformRevisionEventQuery, {
            variables: { id },
        }),
        buildButtonsProps: (data, orgPermissions) => [
            ...buildCustomPlatformRevisionButtons(
                data.me.orgs,
                data.getPlatformEvent.platform_revision.platform.tag_manager_account.org,
                data.getPlatformEvent.platform_revision.platform.tag_manager_account,
                data.getPlatformEvent.platform_revision.platform.tag_manager_account.org
                    .data_manager_account,
                data.getPlatformEvent.platform_revision.platform.tag_manager_account.platforms.filter(
                    (_) => _.type === PlatformType.CUSTOM,
                ),
                data.getPlatformEvent.platform_revision.platform,
                data.getPlatformEvent.platform_revision.platform.platform_revisions,
                data.getPlatformEvent.platform_revision,
                router,
                orgPermissions,
                useSignup,
                'Events',
            ),
            buildPlatformRevisionEventButtonProps(
                router,
                data.getPlatformEvent.platform_revision.platform_events,
                id,
                data.getPlatformEvent.name,
                true,
            ),
        ],
        buildMenuItemsProps: () => [],
        extractOrgUserDetails: (data) =>
            data.getPlatformEvent.platform_revision.platform.tag_manager_account.org,
        accountExpireIn: orgUserState?.tagManagerAccount.trialExpiration ?? undefined,
        accountExpired: orgUserState?.tagManagerAccount.trialExpired ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount.isTrial ?? undefined,
    };

    return <Section<NavPlatformRevisionEvent> {...sectionProps} />;
};

export default PlatformEventSection;
