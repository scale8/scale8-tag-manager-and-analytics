import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { useLoggedInState } from '../../context/AppContext';
import Navigate from '../../components/atoms/Next/Navigate';
import { toOrgSelect, toOrgsAdministration } from '../../utils/NavigationPaths';
import { QueryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
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

    const pageAdminDashboardQuery = useQuery(PageAdminDashboardQuery);

    if (!userIsAdmin) {
        return <Navigate to={toOrgSelect} />;
    }

    return QueryLoaderAndError<PageAdminDashboardData>(
        true,
        pageAdminDashboardQuery,
        (queryData: PageAdminDashboardData) => {
            const organizations = queryData.getOrgs.length;

            const buildAdminParagraphs = () => (
                <DashboardParagraphs
                    paragraphs={[
                        () => (
                            <>
                                There are <b>{organizations}</b> Organizations in total.
                            </>
                        ),
                    ]}
                />
            );

            const dashboardProps: DashboardProps = {
                dashboardSections: [
                    {
                        title: 'Organizations',
                        content: buildAdminParagraphs,
                        linkText: 'Go Orgs Administration',
                        action: () => {
                            router.push(toOrgsAdministration).then();
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
