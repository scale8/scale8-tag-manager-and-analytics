import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { UTCTimestamp } from '../../utils/DateTimeUtils';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { UserInvitePageData } from '../../gql/generated/UserInvitePageData';
import Navigate from '../../components/atoms/Next/Navigate';
import { toOrgSelect } from '../../utils/NavigationPaths';
import { buildAddAction, buildDeleteAction } from '../../utils/TableActionsUtils';
import { pageActions } from '../../actions/PageActions';
import { buildPermissionString } from '../../utils/PermissionsUtils';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import PageUserInviteQuery from '../../gql/queries/PageUserInviteQuery';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import { useLoggedInState } from '../../context/AppContext';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';

export type UserInviteTableRow = {
    id: string;
    email: string;
    permissions: string;
    createdAt: UTCTimestamp;
};

const UserInvitesPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const orgId = props.params.id ?? '';
    const { orgUserState, templateInteractions } = useLoggedInState();
    const { ask } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const userInviteTablePageProps: TablePageProps<UserInviteTableRow, UserInvitePageData> = {
        title: 'User Invites',
        mainInfoProps: buildStandardMainInfo('userInvitations'),
        mainQuery: useQuery(PageUserInviteQuery, {
            variables: { id: orgId },
        }),
        tableId: 'UserInvites',
        entityName: 'Invite',
        columns: buildTableColumns('userInvitations', [
            { field: 'email' },
            { field: 'id' },
            { field: 'permissions' },
            { field: 'createdAt' },
        ]),
        mapTableData: (data) =>
            data.getOrg.invites.map((invite): UserInviteTableRow => {
                return {
                    id: invite.id,
                    email: invite.email,
                    permissions: buildPermissionString(invite.org_permissions),
                    createdAt: invite.created_at as UTCTimestamp,
                };
            }),
        buildRowActions: (pageActionProps) => [
            buildDeleteAction(
                ({ email, id }) =>
                    ask(`Cancel Invitation: ${email}?`, () => {
                        pageActions.cancelInvitation(pageActionProps, id, orgId);
                    }),
                'Cancel Invitation',
                () => false,
            ),
        ],
        buildFreeActions: (pageActionProps) => [
            buildAddAction(
                () => pageActions.inviteUser(pageActionProps, orgId),
                'Invite User',
                () => !currentOrgPermissions.canCreate,
            ),
        ],
    };

    if (!currentOrgPermissions.isAdmin) {
        return <Navigate to={toOrgSelect} />;
    }

    return <TablePage<UserInviteTableRow, UserInvitePageData> {...userInviteTablePageProps} />;
};

export default UserInvitesPage;
