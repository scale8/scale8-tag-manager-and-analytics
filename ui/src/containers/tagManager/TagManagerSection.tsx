import { FC } from 'react';
import { useQuery } from '@apollo/client';
import {
    BreadcrumbButtonProps,
    buildTabButtonProps,
    buildTagManagerButtonPropsAndCheckAccounts,
    ButtonAccount,
} from '../../utils/BreadcrumbButtonsUtils';
import NavTagManagerQuery from '../../gql/queries/NavTagManagerQuery';
import { NavTagManager } from '../../gql/generated/NavTagManager';
import AppIcon from '../../components/atoms/Icons/AppIcon';
import PlatformIcon from '../../components/atoms/Icons/PlatformIcon';
import { Section, SectionItem, SectionProps } from '../abstractions/Section';
import { SectionKey } from '../SectionsDetails';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import { NextRouter, useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../types/props/ChildrenAndIdProps';
import { toTagManager } from '../../utils/NavigationPaths';
import { buildOrgButtons } from '../global/OrgSection';
import { PageMenuButtonProps } from '../../components/molecules/SideMenuButton';
import { CurrentOrgPermissions } from '../../context/OrgUserReducer';

export const buildTagManagerTabsMenu = (id: string): PageMenuButtonProps[] => [
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
];

export const buildTagManagerButtons = (
    orgs: SectionItem[],
    currentOrg: SectionItem,
    tagManagerAccount: ButtonAccount,
    dataManagerAccount: ButtonAccount,
    router: NextRouter,
    orgPermissions: CurrentOrgPermissions,
    useSignup: boolean,
    forceCurrentEntry?: string,
): BreadcrumbButtonProps[] => [
    ...buildOrgButtons(orgs, currentOrg, router, orgPermissions, useSignup, 'Services'),
    buildTagManagerButtonPropsAndCheckAccounts(
        router,
        tagManagerAccount,
        dataManagerAccount,
        forceCurrentEntry === undefined,
    ),
    buildTabButtonProps(router, buildTagManagerTabsMenu(tagManagerAccount.id), forceCurrentEntry),
];

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
        buildButtonsProps: (data, orgPermissions) => {
            return buildTagManagerButtons(
                data.me.orgs,
                data.getTagManagerAccount.org,
                data.getTagManagerAccount,
                data.getTagManagerAccount.org.data_manager_account,
                router,
                orgPermissions,
                useSignup,
            );
        },
        buildMenuItemsProps: () => buildTagManagerTabsMenu(id),
        accountExpireIn: orgUserState?.tagManagerAccount.trialExpiration ?? undefined,
        accountExpired: orgUserState?.tagManagerAccount.trialExpired ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount.isTrial ?? undefined,
    };

    return <Section<NavTagManager> {...sectionProps} />;
};

export default TagManagerSection;
