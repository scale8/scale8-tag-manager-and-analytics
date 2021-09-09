import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { useLoggedInState } from '../../context/AppContext';
import Navigate from '../../components/atoms/Next/Navigate';
import { toOrgSelect, toSignupApproval } from '../../utils/NavigationPaths';
import { queryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import { PageAdminDashboardData } from '../../gql/generated/PageAdminDashboardData';
import PageAdminDashboardQuery from '../../gql/queries/PageAdminDashboardQuery';
import { DashboardParagraphs } from '../../components/molecules/DashboardParagraphs';
import { Dashboard, DashboardProps } from '../../components/organisms/Dashboard';
import { useRouter } from 'next/router';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';

const AdminDashboardPage: FC<DynamicPageProps> = () => {
    const { loggedInUserState } = useLoggedInState();
    const { userIsAdmin } = loggedInUserState;

    const router = useRouter();

    if (!userIsAdmin) {
        return <Navigate to={toOrgSelect} />;
    }

    return queryLoaderAndError<PageAdminDashboardData>(
        true,
        useQuery(PageAdminDashboardQuery),
        () => {
            const signupRequests = 0;

            const buildAdminParagraphs = () => (
                <DashboardParagraphs
                    paragraphs={[
                        () => (
                            <>
                                There are <b>{signupRequests}</b> pending signup requests.
                            </>
                        ),
                    ]}
                />
            );

            const dashboardProps: DashboardProps = {
                dashboardSections: [
                    {
                        title: 'Signup Requests',
                        content: buildAdminParagraphs,
                        linkText: 'Go to SignUp Approval',
                        action: () => {
                            router.push(toSignupApproval).then();
                        },
                    },
                ],
            };

            return (
                <>
                    <Dashboard {...dashboardProps} />
                </>
            );
        },
    );
};

export default AdminDashboardPage;
