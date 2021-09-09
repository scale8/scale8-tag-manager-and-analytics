import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { TableRowBase } from '../../types/TableRow';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { OrgUserPageData } from '../../gql/generated/OrgUserPageData';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import PageOrgUserQuery from '../../gql/queries/PageOrgUserQuery';
import { extractBaseColumns } from '../../utils/TableRowUtils';
import { buildPermissionString } from '../../utils/PermissionsUtils';
import {
    buildAddAction,
    buildDeleteAction,
    buildEditAction,
    buildFieldAction,
    buildPasswordAction,
} from '../../utils/TableActionsUtils';
import { pageActions } from '../../actions/PageActions';
import Navigate from '../../components/atoms/Next/Navigate';
import { toOrgSelect } from '../../utils/NavigationPaths';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';

export type OrgUserTableRow = TableRowBase & {
    name: string;
    permissions: string;
    twoFactorAuth: boolean;
    owner: boolean;
};

const OrgUsersPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const orgId = props.params.id ?? '';
    const { useSignup, useTwoFactorAuth } = useConfigState();
    const { orgUserState, loggedInUserState, templateInteractions } = useLoggedInState();
    const { loggedUserId } = loggedInUserState;
    const { ask } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const orgUserTablePageProps: TablePageProps<OrgUserTableRow, OrgUserPageData> = {
        title: 'Organization Users',
        mainInfoProps: buildStandardMainInfo('organizationUsers'),
        mainQuery: useQuery(PageOrgUserQuery, {
            variables: { id: orgId },
        }),
        tableId: 'OrgUsers',
        entityName: 'User',
        columns: buildTableColumns(
            'organizationUsers',
            useTwoFactorAuth
                ? [
                      { field: 'name' },
                      { field: 'id' },
                      { field: 'permissions' },
                      { title: '2-Factor Auth', field: 'twoFactorAuth', type: 'boolean' },
                      {
                          title: 'Organization Owner',
                          field: 'owner',
                          type: 'boolean',
                      },
                      { field: 'updatedAt' },
                      { field: 'createdAt' },
                  ]
                : [
                      { field: 'name' },
                      { field: 'id' },
                      { field: 'permissions' },
                      {
                          title: 'Organization Owner',
                          field: 'owner',
                          type: 'boolean',
                      },
                      { field: 'updatedAt' },
                      { field: 'createdAt' },
                  ],
        ),
        mapTableData: (data) =>
            data.getOrg.users.map((orgUser): OrgUserTableRow => {
                return {
                    ...extractBaseColumns(orgUser),
                    name: `${orgUser.first_name} ${orgUser.last_name}`,
                    permissions: buildPermissionString(orgUser.permissions),
                    twoFactorAuth: orgUser.two_factor_auth,
                    owner: orgUser.owner,
                };
            }),
        buildRowActions: (pageActionProps) => [
            buildPasswordAction(
                ({ name, id }) =>
                    ask(`Regenerate Password for: ${name}?`, () => {
                        pageActions.regenerateUserPassword(pageActionProps, id, orgId, name);
                    }),
                'Regenerate User Password',
                ({ id, owner }) => owner || id === loggedUserId || !currentOrgPermissions.canEdit,
            ),
            buildEditAction(
                ({ id }) => pageActions.updateUserPermissions(pageActionProps, id, orgId),
                'Update User Permissions',
                ({ id, owner }) => owner || id === loggedUserId || !currentOrgPermissions.canEdit,
            ),
            buildDeleteAction(
                ({ name, id }) =>
                    ask(`Remove User: ${name}?`, () => {
                        pageActions.removeUser(pageActionProps, id, orgId);
                    }),
                'Remove User',
                ({ id, owner }) => owner || id === loggedUserId || !currentOrgPermissions.canDelete,
            ),
        ],
        buildFreeActions: (pageActionProps) => {
            if (useSignup) {
                return [
                    buildAddAction(
                        () => pageActions.inviteUser(pageActionProps, orgId),
                        'Invite User',
                        () => !currentOrgPermissions.canCreate,
                    ),
                ];
            }
            return [
                buildAddAction(
                    () =>
                        pageActions.addUser(
                            pageActionProps,
                            orgId,
                            (id: string, pageRefresh: () => void) => {
                                pageActions.regenerateUserPassword(pageActionProps, id, orgId, '');
                                pageRefresh();
                            },
                        ),
                    'Add User',
                    () => !currentOrgPermissions.canCreate,
                ),
            ];
        },
        buildFieldActions: (pageActionProps) => [
            buildFieldAction(
                'permissions',
                ({ id }) => pageActions.updateUserPermissions(pageActionProps, id, orgId),
                'Update User Permissions',
                ({ id, owner }) => owner || id === loggedUserId || !currentOrgPermissions.canEdit,
            ),
        ],
    };

    if (!currentOrgPermissions.isAdmin) {
        return <Navigate to={toOrgSelect} />;
    }

    return <TablePage<OrgUserTableRow, OrgUserPageData> {...orgUserTablePageProps} />;
};

export default OrgUsersPage;
