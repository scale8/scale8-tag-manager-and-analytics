import { FC, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { TableRowBase } from '../../types/TableRow';
import { useRouter } from 'next/router';
import { useLoggedInState } from '../../context/AppContext';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import { PageActionProps, pageActions } from '../../actions/PageActions';
import { toApp, toTagManager } from '../../utils/NavigationPaths';
import { AppPageData } from '../../gql/generated/AppPageData';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import PageAppQuery from '../../gql/queries/PageAppQuery';
import { appGroupingCountToSparkData, buildSparkQueryOptions } from '../../utils/SparkDataUtils';
import { extractBaseColumns } from '../../utils/TableRowUtils';
import {
    buildAddAction,
    buildDeleteAction,
    buildEditAction,
    buildFieldAction,
    buildSelectAction,
} from '../../utils/TableActionsUtils';

export type AppTableRow = TableRowBase & {
    name: string;
    type: string;
    domain: string;
    pageViews: number[];
    revisions: number;
};

const AppsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const accountId = props.params.id ?? '';
    const action = props.params.action;

    const router = useRouter();

    const { orgUserState, templateInteractions } = useLoggedInState();
    const { ask, dispatchDialogAction, setRefreshCurrentPage } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    useEffect(() => {
        if (action === 'add') {
            const pageActionProps: PageActionProps = {
                dispatchDialogAction,
                refresh: () => {
                    setRefreshCurrentPage(true);
                },
            };

            router.push(toTagManager({ id: accountId }, 'apps')).then();

            pageActions.createApplication(
                pageActionProps,
                accountId,
                (id: string, pageRefresh: () => void) => {
                    pageRefresh();
                    pageActions.installApp(pageActionProps, id);
                },
            );
        }
    }, [action]);

    const appTablePageProps: TablePageProps<AppTableRow, AppPageData> = {
        title: 'Applications',
        mainInfoProps: buildStandardMainInfo('applications'),
        mainQuery: useQuery(PageAppQuery, {
            variables: {
                id: accountId,
                appQueryOptions: buildSparkQueryOptions(),
            },
            notifyOnNetworkStatusChange: true,
        }),
        tableId: 'Apps',
        entityName: 'Application',
        columns: buildTableColumns('applications', [
            { field: 'name' },
            { field: 'id' },
            { title: 'Page views', field: 'pageViews', type: 'graph' },
            { field: 'type', hidden: true },
            { field: 'domain' },
            { field: 'revisions', hidden: true },
            { field: 'updatedAt' },
            { field: 'createdAt' },
        ]),
        mapTableData: (data) =>
            data.getTagManagerAccount.apps.map((app): AppTableRow => {
                return {
                    ...extractBaseColumns(app),
                    name: app.name,
                    type: app.type,
                    domain: app.domain,
                    revisions: app.revisions.length,
                    pageViews: appGroupingCountToSparkData(
                        app.event_request_stats.from as number,
                        app.event_request_stats.to as number,
                        app.event_request_stats.result,
                    ),
                };
            }),

        buildRowActions: (pageActionProps) => [
            buildEditAction(
                ({ id }) => pageActions.updateApplication(pageActionProps, id),
                'Edit Application',
                () => !currentOrgPermissions.canEdit,
            ),
            buildDeleteAction(
                ({ name, id }) =>
                    ask(`Delete Application: ${name}?`, () => {
                        pageActions.deleteApplication(pageActionProps, id);
                    }),
                `Delete Application`,
                () => !currentOrgPermissions.canDelete,
            ),
            buildSelectAction(
                ({ id }) => router.push(toApp({ id })).then(),
                `Select Application`,
                () => !currentOrgPermissions.canView,
            ),
        ],
        buildFreeActions: (pageActionProps) => [
            buildAddAction(
                () =>
                    pageActions.createApplication(
                        pageActionProps,
                        accountId,
                        (id: string, pageRefresh: () => void) => {
                            pageRefresh();
                            pageActions.installApp(pageActionProps, id);
                        },
                    ),
                'Add Application',
                () => !currentOrgPermissions.canCreate,
            ),
        ],
        buildFieldActions: () => [
            buildFieldAction(
                'name',
                ({ id }) => router.push(toApp({ id })).then(),
                `Select Application`,
                () => !currentOrgPermissions.canView,
            ),
        ],
        buildEmptyAction: (pageActionProps) => ({
            onClick: () =>
                pageActions.createApplication(
                    pageActionProps,
                    accountId,
                    (id: string, pageRefresh: () => void) => {
                        pageRefresh();
                        pageActions.installApp(pageActionProps, id);
                    },
                ),
            text: 'Create your first application',
        }),
    };

    return <TablePage<AppTableRow, AppPageData> {...appTablePageProps} />;
};

export default AppsPage;
