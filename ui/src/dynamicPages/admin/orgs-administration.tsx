import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import Navigate from '../../components/atoms/Next/Navigate';
import { toOrgSelect } from '../../utils/NavigationPaths';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import OrgsAdminQuery from '../../gql/queries/OrgsAdminQuery';
import { buildGoInAction, buildManualInvoicingAction } from '../../utils/TableActionsUtils';
import { pageActions } from '../../actions/PageActions';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { OrgsAdminPageData } from '../../gql/generated/OrgsAdminPageData';
import { extractBaseColumns } from '../../utils/TableRowUtils';
import { TableRowBase } from '../../types/TableRow';
import {
    accountDetailsFromOrgWithAccounts,
    buildDataManagerPlanDetails,
    buildTagManagerPlanDetails,
    planDetailsToString,
} from '../../utils/AccountUtils';
import { formatBytes } from '../../utils/MathUtils';

export type OrgsAdministrationTableRow = TableRowBase & {
    name: string;
    tmPlan: string;
    tmReq: string;
    dmPlan: string;
    dmReq: string;
    dmData: string;
    iAmIn: boolean;
    manualInvoicing: boolean;
    users: number;
    owner: string;
    ownerEmail: string;
};

const AdminOrgsAdministrationPage: FC<DynamicPageProps> = () => {
    const { tagManagerProducts, dataManagerProducts } = useConfigState();
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
            { field: 'tmPlan' },
            { field: 'tmReq' },
            { field: 'dmPlan' },
            { field: 'dmReq' },
            { field: 'dmData' },
            { field: 'updatedAt' },
            { field: 'createdAt' },
            { field: 'iAmIn', type: 'boolean' },
            { field: 'manualInvoicing', type: 'boolean', hidden: true },
            { field: 'owner' },
            { field: 'ownerEmail' },
            { field: 'users', type: 'numeric' },
        ]),
        mapTableData: (data) =>
            data.getOrgs.map((org) => {
                const {
                    tagManagerAccount,
                    dataManagerAccount,
                    currentTagManagerProduct,
                    currentDataManagerProduct,
                } = accountDetailsFromOrgWithAccounts(org, tagManagerProducts, dataManagerProducts);

                const tagManagerDetails = buildTagManagerPlanDetails(
                    org,
                    tagManagerAccount,
                    currentTagManagerProduct,
                );

                const dataManagerDetails = buildDataManagerPlanDetails(
                    org,
                    dataManagerAccount,
                    currentDataManagerProduct,
                );

                const owner = org.users.find((_) => _.owner);

                return {
                    ...extractBaseColumns(org),
                    name: org.name,
                    tmPlan: planDetailsToString(tagManagerDetails),
                    tmReq: org.tag_manager_account.billing_cycle_requests.toLocaleString('en-GB'),
                    dmPlan: planDetailsToString(dataManagerDetails),
                    dmReq: org.data_manager_account.billing_cycle_requests.toLocaleString('en-GB'),
                    dmData: formatBytes(org.data_manager_account.billing_cycle_bytes),
                    iAmIn: data.me.orgs.some((_) => _.id === org.id),
                    manualInvoicing: org.manual_invoicing,
                    users: org.users.length,
                    owner: owner ? `${owner.first_name} ${owner.last_name}` : '',
                    ownerEmail: owner ? owner.email : '',
                };
            }),
        buildRowActions: (pageActionProps) => [
            buildGoInAction(
                ({ name, id }) =>
                    ask(`Add yourself to: ${name}?`, () => {
                        pageActions.adminSignupApprove(pageActionProps, id);
                    }),
                'Go in',
                ({ iAmIn }) => iAmIn,
            ),
            buildManualInvoicingAction(
                ({ name, id }) =>
                    ask(`Move ${name} to manual invoicing?`, () => {
                        pageActions.adminSignupApprove(pageActionProps, id);
                    }),
                'Move to manual invoicing',
                ({ manualInvoicing }) => manualInvoicing,
            ),
        ],
    };

    if (!userIsAdmin) {
        return <Navigate to={toOrgSelect} />;
    }

    return <TablePage<OrgsAdministrationTableRow, OrgsAdminPageData> {...signUpTablePageProps} />;
};

export default AdminOrgsAdministrationPage;
