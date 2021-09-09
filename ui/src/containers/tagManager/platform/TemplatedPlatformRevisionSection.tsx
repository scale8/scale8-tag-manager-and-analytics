import { FC } from 'react';
import { useQuery } from '@apollo/client';
import NavPlatformRevisionQuery from '../../../gql/queries/NavPlatformRevisionQuery';
import { NavPlatformRevision } from '../../../gql/generated/NavPlatformRevision';
import {
    buildOrgButtonProps,
    buildPlatformRevisionButtonProps,
    buildTagManagerButtonProps,
    buildTemplatedPlatformButtonProps,
} from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../../abstractions/Section';
import { PlatformType } from '../../../gql/generated/globalTypes';
import { SectionKey } from '../../SectionsDetails';
import { useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';

const TemplatedPlatformRevisionSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState } = useLoggedInState();

    const sectionProps: SectionProps<NavPlatformRevision> = {
        children,
        sectionKey: SectionKey.templatedPlatformRevision,
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
            buildTemplatedPlatformButtonProps(
                router,
                data.getPlatformRevision.platform.tag_manager_account.platforms.filter(
                    (_) => _.type === PlatformType.TEMPLATED,
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
