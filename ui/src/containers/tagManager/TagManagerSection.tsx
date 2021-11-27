import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { buildTagManagerButtonProps } from '../../utils/BreadcrumbButtonsUtils';
import NavTagManagerQuery from '../../gql/queries/NavTagManagerQuery';
import { NavTagManager } from '../../gql/generated/NavTagManager';
import AppIcon from '../../components/atoms/Icons/AppIcon';
import PlatformIcon from '../../components/atoms/Icons/PlatformIcon';
import { Section, SectionProps } from '../abstractions/Section';
import { SectionKey } from '../SectionsDetails';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../types/props/ChildrenAndIdProps';
import { toTagManager } from '../../utils/NavigationPaths';
import { buildOrgButtons } from '../global/OrgSection';
import OrgDashboardIcon from '../../components/atoms/Icons/OrgDashboardIcon';

const TagManagerSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState } = useLoggedInState();
    const { useSignup } = useConfigState();

    const sectionProps: SectionProps<NavTagManager> = {
        children,
        sectionKey: SectionKey.tagManager,
        extractOrgUserDetails: (data) => data.getTagManagerAccount.org,
        queryResult: useQuery<NavTagManager>(NavTagManagerQuery, {
            variables: { id },
        }),
        buildButtonsProps: (data, orgPermissions) => [
            ...buildOrgButtons(
                data.me.orgs,
                data.getTagManagerAccount.org,
                router,
                orgPermissions,
                useSignup,
                'Services',
                () => <OrgDashboardIcon />,
            ),
            buildTagManagerButtonProps(
                router,
                id,
                data.getTagManagerAccount.org.data_manager_account?.id ?? '',
                true,
            ),
        ],
        buildMenuItemsProps: () => [
            {
                icon: () => <AppIcon />,
                label: 'Applications',
                link: toTagManager({ id }, 'apps'),
            },
            {
                icon: () => <PlatformIcon />,
                label: 'Platforms',
                link: toTagManager({ id }, 'platforms'),
            },
        ],
        accountExpireIn: orgUserState?.tagManagerAccount?.trialExpiration ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount?.isTrial ?? undefined,
    };

    return <Section<NavTagManager> {...sectionProps} />;
};

export default TagManagerSection;
