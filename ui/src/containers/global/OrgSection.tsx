import { FC } from 'react';
import { useQuery } from '@apollo/client';
import NavOrgQuery from '../../gql/queries/NavOrgQuery';
import { NavOrg } from '../../gql/generated/NavOrg';
import {
    BreadcrumbButtonProps,
    buildOrgButtonProps,
    buildTabButtonProps,
} from '../../utils/BreadcrumbButtonsUtils';
import OrgDashboardIcon from '../../components/atoms/Icons/OrgDashboardIcon';
import OrgUsersIcon from '../../components/atoms/Icons/OrgUsersIcon';
import UserInviteIcon from '../../components/atoms/Icons/UserInviteIcon';
import { Section, SectionItem, SectionProps } from '../abstractions/Section';
import { SectionKey } from '../SectionsDetails';
import OrgSettingsIcon from '../../components/atoms/Icons/OrgSettingsIcon';
import { useConfigState } from '../../context/AppContext';
import { NextRouter, useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../types/props/ChildrenAndIdProps';
import { toOrg } from '../../utils/NavigationPaths';
import { PageMenuButtonProps } from '../../components/molecules/SideMenuButton';
import { CurrentOrgPermissions } from '../../context/OrgUserReducer';

export const buildOrgTabsMenu = (
    orgPermissions: CurrentOrgPermissions,
    id: string,
    useSignup: boolean,
): PageMenuButtonProps[] => {
    return [
        ...[
            {
                icon: () => <OrgDashboardIcon />,
                label: 'Services',
                link: toOrg({ id }, 'dashboard'),
            },
            {
                icon: () => <OrgUsersIcon />,
                label: 'Users',
                link: toOrg({ id }, 'users'),
                disabled: !orgPermissions.isAdmin,
            },
        ],
        ...(useSignup
            ? [
                  {
                      icon: () => <UserInviteIcon />,
                      label: 'User Invites',
                      link: toOrg({ id }, 'invites'),
                      disabled: !orgPermissions.isAdmin,
                  },
              ]
            : []),
        {
            icon: () => <OrgSettingsIcon />,
            label: 'Settings',
            link: toOrg({ id }, 'settings'),
            disabled: !orgPermissions.isAdmin,
        },
    ];
};

export const buildOrgButtons = (
    orgs: SectionItem[],
    currentOrg: SectionItem,
    router: NextRouter,
    orgPermissions: CurrentOrgPermissions,
    useSignup: boolean,
    forceCurrentEntry?: string,
): BreadcrumbButtonProps[] => [
    buildOrgButtonProps(
        router,
        orgs,
        currentOrg.id,
        currentOrg.name,
        forceCurrentEntry === undefined,
    ),
    buildTabButtonProps(
        router,
        buildOrgTabsMenu(orgPermissions, currentOrg.id, useSignup),
        forceCurrentEntry,
    ),
];

const OrgSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { useSignup } = useConfigState();

    const sectionProps: SectionProps<NavOrg> = {
        children,
        sectionKey: SectionKey.org,
        extractOrgUserDetails: (data) => data.getOrg,
        queryResult: useQuery<NavOrg>(NavOrgQuery, {
            variables: { id },
        }),
        buildButtonsProps: (data, orgPermissions) => {
            return buildOrgButtons(data.me.orgs, data.getOrg, router, orgPermissions, useSignup);
        },
        buildMenuItemsProps: (_, orgPermissions) => {
            return buildOrgTabsMenu(orgPermissions, id, useSignup);
        },
    };

    return <Section<NavOrg> {...sectionProps} />;
};

export default OrgSection;
