import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { useLoggedInState } from '../../context/AppContext';
import Navigate from '../../components/atoms/Next/Navigate';
import { toOrgSelect } from '../../utils/NavigationPaths';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import OrgsAdminQuery from '../../gql/queries/OrgsAdminQuery';
import { buildApproveAction } from '../../utils/TableActionsUtils';
import { pageActions } from '../../actions/PageActions';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { OrgsAdminPageData } from '../../gql/generated/OrgsAdminPageData';
import { extractBaseColumns } from '../../utils/TableRowUtils';
import { TableRowBase } from '../../types/TableRow';

export type OrgsAdministrationTableRow = TableRowBase & {
    name: string;
};

const AdminOrgsAdministrationPage: FC<DynamicPageProps> = () => {
    const { templateInteractions, loggedInUserState } = useLoggedInState();
    const { userIsAdmin } = loggedInUserState;
    const { ask } = templateInteractions;

    const signUpTablePageProps: TablePageProps<OrgsAdministrationTableRow, OrgsAdminPageData> = {
        title: 'Orgs Administration',
        mainInfoProps: buildStandardMainInfo('adminOrgs'),
        mainQuery: useQuery(OrgsAdminQuery),
        tableId: 'Orgs-admin',
        entityName: 'Org',
        columns: buildTableColumns('adminOrgs', [
            { field: 'id' },
            { field: 'name' },
            { field: 'updatedAt' },
            { field: 'createdAt' },
        ]),
        mapTableData: (data) =>
            data.getOrgs.map((org) => ({
                ...extractBaseColumns(org),
                name: org.name,
            })),
        buildRowActions: (pageActionProps) => [
            buildApproveAction(
                ({ email, id }) =>
                    ask(`Approve signup with email: ${email}?`, () => {
                        pageActions.adminSignupApprove(pageActionProps, id);
                    }),
                'Approve',
            ),
        ],
    };

    if (!userIsAdmin) {
        return <Navigate to={toOrgSelect} />;
    }

    return <TablePage<OrgsAdministrationTableRow, OrgsAdminPageData> {...signUpTablePageProps} />;
};

export default AdminOrgsAdministrationPage;
