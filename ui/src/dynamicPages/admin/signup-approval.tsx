import { FC } from 'react';
import { useQuery } from '@apollo/client';
import Head from 'next/head';
import { LoggedInSection } from '../../containers/global/LoggedInSection';
import AdminSection from '../../containers/global/AdminSection';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { AdminPageData } from '../../gql/generated/AdminPageData';
import { UTCTimestamp } from '../../utils/DateTimeUtils';
import { useLoggedInState } from '../../context/AppContext';
import Navigate from '../../components/atoms/Next/Navigate';
import { toOrgSelect } from '../../utils/NavigationPaths';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import PageAdminQuery from '../../gql/queries/PageAdminQuery';
import { buildApproveAction } from '../../utils/TableActionsUtils';
import { pageActions } from '../../actions/PageActions';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';

export type SignupApprovalTableRow = {
    id: string;
    companyName: string;
    domain: string;
    pageViewsPerMonth: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: UTCTimestamp;
};

const AdminSignUpApprovalPage: FC<DynamicPageProps> = () => {
    const { templateInteractions, loggedInUserState } = useLoggedInState();
    const { userIsAdmin } = loggedInUserState;
    const { ask } = templateInteractions;

    const signUpTablePageProps: TablePageProps<SignupApprovalTableRow, AdminPageData> = {
        title: 'Sign Up Approval',
        mainInfoProps: buildStandardMainInfo('adminApprovals'),
        mainQuery: useQuery(PageAdminQuery),
        tableId: 'Sign-ups',
        entityName: 'Sign Up',
        columns: buildTableColumns('adminApprovals', [
            { field: 'id' },
            { field: 'firstName' },
            { field: 'lastName' },
            { field: 'companyName' },
            { field: 'domain' },
            { title: 'PV/M', field: 'pageViewsPerMonth', type: 'numeric' },
            { field: 'email' },
            { field: 'createdAt' },
        ]),
        mapTableData: () => [],
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

    return <TablePage<SignupApprovalTableRow, AdminPageData> {...signUpTablePageProps} />;
};

export default AdminSignUpApprovalPage;
