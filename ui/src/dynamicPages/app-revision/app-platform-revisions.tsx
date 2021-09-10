import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { TableRowBase } from '../../types/TableRow';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import { useRouter } from 'next/router';
import { PageActionProps, pageActions } from '../../actions/PageActions';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { AppPlatformRevisionPageData } from '../../gql/generated/AppPlatformRevisionPageData';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import PageAppPlatformRevisionQuery from '../../gql/queries/PageAppPlatformRevisionQuery';
import { extractBaseColumns } from '../../utils/TableRowUtils';
import {
    buildAddAction,
    buildDeleteAction,
    buildEditAction,
    buildHistoryAction,
} from '../../utils/TableActionsUtils';
import { toAppRevision } from '../../utils/NavigationPaths';

export type AppPlatformRevisionTableRow = TableRowBase & {
    platformRevisionId: string;
    name: string;
    platform: string;
};

const AppPlatformRevisionsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const revisionId = props.params.id ?? '';

    const router = useRouter();
    const { isAuditEnabled } = useConfigState();
    const { templateInteractions, orgUserState } = useLoggedInState();
    const { dispatchDialogAction } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const pageActionProps: PageActionProps = { dispatchDialogAction };

    const appPlatformTablePageProps: TablePageProps<
        AppPlatformRevisionTableRow,
        AppPlatformRevisionPageData
    > = {
        title: 'Platform Revisions',
        mainInfoProps: buildStandardMainInfo('appPlatformRevisions'),
        mainQuery: useQuery(PageAppPlatformRevisionQuery, {
            variables: { id: revisionId },
        }),
        tableId: 'AppPlatformRevisions',
        entityName: 'Platform Revision',
        columns: buildTableColumns('appPlatformRevisions', [
            { field: 'name' },
            { field: 'id' },
            { field: 'platform' },
            { field: 'updatedAt' },
            { field: 'createdAt' },
        ]),
        mapTableData: (data) =>
            data.getRevision.app_platform_revisions.map(
                (appPlatformRevision): AppPlatformRevisionTableRow => {
                    const platformRevision = appPlatformRevision.platform_revision;
                    return {
                        ...extractBaseColumns(appPlatformRevision),
                        platformRevisionId: platformRevision.id,
                        name: platformRevision.name,
                        platform: platformRevision.platform.name,
                    };
                },
            ),
        buildRowActions: (pageActionProps) => [
            buildHistoryAction(
                ({ id, name }) =>
                    pageActions.showAppPlatformRevisionHistory(pageActionProps, id, name),
                'Platform Revision History',
                () => !currentOrgPermissions.canView,
                () => !isAuditEnabled,
            ),
            buildEditAction(
                ({ id }) => pageActions.updateAppPlatformRevision(pageActionProps, id, revisionId),
                'Change Platform Revision Link',
                () => !currentOrgPermissions.canEdit,
            ),
            buildDeleteAction(
                ({ name, id }) => pageActions.unlinkAppPlatformRevision(pageActionProps, id, name),
                'Unlink Platform Revision',
                () => !currentOrgPermissions.canDelete,
            ),
        ],
        buildFreeActions: (pageActionProps) => [
            buildAddAction(
                () => pageActions.linkAppPlatformRevision(pageActionProps, revisionId),
                'Install Platform',
                () => !currentOrgPermissions.canCreate,
            ),
        ],
        tableLockOnRevision: (data) => data.getRevision.locked,
        buildTableRevisionCloneAction: (data) => () =>
            pageActions.duplicateAppRevision(
                pageActionProps,
                data.getRevision.id,
                (
                    id: string,
                    pageRefresh: () => void,
                    handleDialogClose: (checkChanges: boolean) => void,
                ) => {
                    handleDialogClose(false);
                    router.push(toAppRevision({ id }, 'app-platform-revisions')).then();
                },
            ),
    };

    return (
        <TablePage<AppPlatformRevisionTableRow, AppPlatformRevisionPageData>
            {...appPlatformTablePageProps}
        />
    );
};

export default AppPlatformRevisionsPage;
