import { FC } from 'react';
import { useQuery } from '@apollo/client';
import NavPlatformRevisionQuery from '../../../gql/queries/NavPlatformRevisionQuery';
import { NavPlatformRevision } from '../../../gql/generated/NavPlatformRevision';
import { buildPlatformRevisionButtonProps } from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../../abstractions/Section';
import { PlatformType } from '../../../gql/generated/globalTypes';
import { SectionKey } from '../../SectionsDetails';
import { useConfigState, useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';
import { buildPlatformButtons } from './PlatformSection';

const TemplatedPlatformRevisionSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState } = useLoggedInState();
    const { useSignup } = useConfigState();

    const sectionProps: SectionProps<NavPlatformRevision> = {
        children,
        sectionKey: SectionKey.templatedPlatformRevision,
        queryResult: useQuery<NavPlatformRevision>(NavPlatformRevisionQuery, {
            variables: { id },
        }),
        buildButtonsProps: (data, orgPermissions) => [
            ...buildPlatformButtons(
                PlatformType.TEMPLATED,
                data.me.orgs,
                data.getPlatformRevision.platform.tag_manager_account.org,
                data.getPlatformRevision.platform.tag_manager_account.id,
                data.getPlatformRevision.platform.tag_manager_account.org.data_manager_account
                    ?.id ?? '',
                data.getPlatformRevision.platform.tag_manager_account.platforms.filter(
                    (_) => _.type === PlatformType.TEMPLATED,
                ),
                data.getPlatformRevision.platform,
                router,
                orgPermissions,
                useSignup,
                false,
            ),
            buildPlatformRevisionButtonProps(
                router,
                data.getPlatformRevision.platform.platform_revisions,
                id,
                data.getPlatformRevision.name,
                true,
                true,
            ),
        ],
        buildMenuItemsProps: () => [],
        extractOrgUserDetails: (data) => data.getPlatformRevision.platform.tag_manager_account.org,
        accountExpireIn: orgUserState?.tagManagerAccount?.trialExpiration ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount?.isTrial ?? undefined,
    };

    return <Section<NavPlatformRevision> {...sectionProps} />;
};

export default TemplatedPlatformRevisionSection;
