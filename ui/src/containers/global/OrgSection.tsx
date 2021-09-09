import { FC } from 'react';
import { useQuery } from '@apollo/client';
import NavOrgQuery from '../../gql/queries/NavOrgQuery';
import { NavOrg } from '../../gql/generated/NavOrg';
import { buildOrgButtonProps } from '../../utils/BreadcrumbButtonsUtils';
import OrgDashboardIcon from '../../components/atoms/Icons/OrgDashboardIcon';
import OrgUsersIcon from '../../components/atoms/Icons/OrgUsersIcon';
import UserInviteIcon from '../../components/atoms/Icons/UserInviteIcon';
import { Section, SectionProps } from '../abstractions/Section';
import { SectionKey } from '../SectionsDetails';
import OrgSettingsIcon from '../../components/atoms/Icons/OrgSettingsIcon';
import { useConfigState } from '../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../types/props/ChildrenAndIdProps';
import { toOrg } from '../../utils/NavigationPaths';

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
        buildButtonsProps: (data) => [
            buildOrgButtonProps(router, data.me.orgs, id ?? '', data.getOrg.name, true),
        ],
        buildMenuItemsProps: (orgPermissions) => {
            return [
                ...[
                    {
                        icon: <OrgDashboardIcon />,
                        label: 'Dashboard',
                        link: toOrg({ id }, 'dashboard'),
                    },
                    {
                        icon: <OrgUsersIcon />,
                        label: 'Users',
                        link: toOrg({ id }, 'users'),
                        disabled: !orgPermissions.isAdmin,
                    },
                ],
                ...(useSignup
                    ? [
                          {
                              icon: <UserInviteIcon />,
                              label: 'User Invites',
                              link: toOrg({ id }, 'invites'),
                              disabled: !orgPermissions.isAdmin,
                          },
                      ]
                    : []),
                {
                    icon: <OrgSettingsIcon />,
                    label: 'Settings',
                    link: toOrg({ id }, 'settings'),
                    disabled: !orgPermissions.isAdmin,
                },
            ];
        },
    };

    return <Section<NavOrg> {...sectionProps} />;
};

export default OrgSection;
