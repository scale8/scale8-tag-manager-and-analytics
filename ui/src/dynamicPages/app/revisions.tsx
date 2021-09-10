import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import { TableRowBase } from '../../types/TableRow';
import { useRouter } from 'next/router';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { AppRevisionPageData } from '../../gql/generated/AppRevisionPageData';
import PageAppRevisionQuery from '../../gql/queries/PageAppRevisionQuery';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import { appGroupingCountToSparkData, buildSparkQueryOptions } from '../../utils/SparkDataUtils';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import { extractBaseColumns } from '../../utils/TableRowUtils';
import {
    buildCompareAction,
    buildDeployAction,
    buildDuplicateAction,
    buildEditAction,
    buildFieldAction,
    buildFinaliseAction,
    buildFinalizeAndDeployAction,
    buildHistoryAction,
    buildPreviewAction,
    buildSelectAction,
} from '../../utils/TableActionsUtils';
import { pageActions } from '../../actions/PageActions';
import { toAppRevision } from '../../utils/NavigationPaths';

export type AppRevisionTableRow = TableRowBase & {
    name: string;
    tags: number;
    pageViews: number[];
    platformRevisions: number;
    locked: boolean;
};

const AppRevisionsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const appId = props.params.id ?? '';

    const router = useRouter();

    const { orgUserState, templateInteractions } = useLoggedInState();
    const { ask } = templateInteractions;
    const { isAuditEnabled } = useConfigState();
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const appRevisionsTablePageProps: TablePageProps<AppRevisionTableRow, AppRevisionPageData> = {
        title: 'Revisions',
        mainQuery: useQuery(PageAppRevisionQuery, {
            variables: { id: appId, appQueryOptions: buildSparkQueryOptions() },
        }),
        tableId: 'AppRevisions',
        entityName: 'Revision',
        mainInfoProps: buildStandardMainInfo('appRevisions'),
        columns: buildTableColumns('appRevisions', [
            { field: 'name' },
            { field: 'id' },
            { title: 'Page views', field: 'pageViews', type: 'graph' },
            { field: 'tags', type: 'numeric', hidden: true },
            { field: 'platformRevisions', type: 'numeric', hidden: true },
            { field: 'locked', type: 'boolean' },
            { field: 'updatedAt' },
            { field: 'createdAt' },
        ]),
        mapTableData: (data) =>
            data.getApp.revisions.map((appRevision): AppRevisionTableRow => {
                return {
                    ...extractBaseColumns(appRevision),
                    name: appRevision.name,
                    tags: appRevision.tags.length,
                    pageViews: appGroupingCountToSparkData(
                        appRevision.event_request_stats.from as number,
                        appRevision.event_request_stats.to as number,
                        appRevision.event_request_stats.result,
                    ),
                    platformRevisions: appRevision.app_platform_revisions.length,
                    locked: appRevision.locked,
                };
            }),
        buildRowActions: (pageActionProps) => [
            buildHistoryAction(
                ({ id, name }) => pageActions.showAppRevisionHistory(pageActionProps, id, name),
                'Revision History',
                () => !currentOrgPermissions.canView,
                () => !isAuditEnabled,
            ),
            buildPreviewAction(
                ({ id }) => pageActions.previewAppRevision(pageActionProps, id),
                'Revision Preview',
                () => !currentOrgPermissions.canView,
            ),
            buildEditAction(
                ({ id }) => pageActions.updateAppRevision(pageActionProps, id),
                'Edit Revision',
                () => !currentOrgPermissions.canEdit,
            ),
            buildDuplicateAction(
                ({ id }) =>
                    pageActions.duplicateAppRevision(
                        pageActionProps,
                        id,
                        (
                            id: string,
                            pageRefresh: () => void,
                            handleDialogClose: (checkChanges: boolean) => void,
                        ) => {
                            handleDialogClose(false);
                            pageRefresh();
                        },
                    ),
                `Duplicate Revision`,
                () => !currentOrgPermissions.canCreate,
            ),
            buildFinaliseAction(
                ({ name, id }) =>
                    ask(`Finalise Revision: ${name}?`, () => {
                        pageActions.finaliseAppRevision(pageActionProps, id);
                    }),
                `Finalise Revision`,
                ({ locked }) => !currentOrgPermissions.canEdit || locked,
            ),
            buildDeployAction(
                ({ id }) => pageActions.deployRevision(pageActionProps, id),
                `Deploy Revision`,
                () => !currentOrgPermissions.canEdit,
                ({ locked }) => !locked,
            ),
            buildFinalizeAndDeployAction(
                ({ name, id }) =>
                    ask(`Finalise and Deploy Revision: ${name}?`, () => {
                        pageActions.finaliseAndDeployAppRevision(
                            pageActionProps,
                            id,
                            (id: string, pageRefresh: () => void) => {
                                pageRefresh();
                                pageActions.deployRevision(pageActionProps, id);
                            },
                        );
                    }),

                `Finalize and Deploy Revision`,
                () => !currentOrgPermissions.canEdit,
                ({ locked }) => locked,
            ),
            buildSelectAction(
                ({ id }) => router.push(toAppRevision({ id })).then(),
                `Select Revision`,
                () => !currentOrgPermissions.canView,
            ),
        ],
        buildFieldActions: () => [
            buildFieldAction(
                'name',
                ({ id }) => router.push(toAppRevision({ id })).then(),
                `Select Revision`,
                () => !currentOrgPermissions.canView,
            ),
        ],
        buildCoupleActions: (pageActionProps) => [
            buildCompareAction((leftId: string, rightId: string) => {
                pageActions.compareAppRevisions(pageActionProps, leftId, rightId);
            }, `Compare Revisions`),
        ],
    };

    return <TablePage<AppRevisionTableRow, AppRevisionPageData> {...appRevisionsTablePageProps} />;
};

export default AppRevisionsPage;
