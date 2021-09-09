import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { useLoggedInState } from '../../context/AppContext';
import { useRouter } from 'next/router';
import { TableRowBase } from '../../types/TableRow';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import { PageActionProps, pageActions } from '../../actions/PageActions';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { GlobalActionData } from '../../gql/generated/GlobalActionData';
import PageGlobalActionQuery from '../../gql/queries/PageGlobalActionQuery';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import { extractBaseColumns } from '../../utils/TableRowUtils';
import {
    buildAddAction,
    buildDeleteAction,
    buildDuplicateAction,
    buildEditAction,
    buildFieldAction,
    buildHistoryAction,
    buildSelectAction,
} from '../../utils/TableActionsUtils';
import { toAppRevision, toGlobalAction } from '../../utils/NavigationPaths';

export type GlobalActionsRow = TableRowBase & {
    name: string;
    type: string;
    actionGroups: number;
};

const GlobalActionsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const revisionId = props.params.id ?? '';

    const router = useRouter();
    const { templateInteractions, orgUserState } = useLoggedInState();
    const { dispatchDialogAction } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const pageActionProps: PageActionProps = { dispatchDialogAction };

    const globalActionGroupDistributionsPageProps: TablePageProps<
        GlobalActionsRow,
        GlobalActionData
    > = {
        title: 'Global Action Group Distributions',
        mainQuery: useQuery(PageGlobalActionQuery, {
            variables: { id: revisionId },
        }),
        tableId: 'GlobalActions',
        entityName: 'Global Action Group Distribution',
        mainInfoProps: buildStandardMainInfo('globalActions'),
        columns: buildTableColumns('globalActions', [
            { field: 'name' },
            { field: 'id' },
            { field: 'type' },
            { field: 'actionGroups', type: 'numeric' },
            { field: 'updatedAt' },
            { field: 'createdAt' },
        ]),
        mapTableData: (data) =>
            data.getRevision.global_action_group_distributions.map((actionGd): GlobalActionsRow => {
                return {
                    ...extractBaseColumns(actionGd),
                    name: actionGd.name,
                    type:
                        actionGd.action_group_distribution_type.charAt(0).toUpperCase() +
                        actionGd.action_group_distribution_type.slice(1).toLowerCase(),
                    actionGroups: actionGd.action_groups.length,
                };
            }),

        buildRowActions: (pageActionProps) => [
            buildHistoryAction(
                ({ id, name }) =>
                    pageActions.showActionGroupDistributionHistory(pageActionProps, id, name),
                'Action Group Distribution History',
                () => !currentOrgPermissions.canView,
            ),
            buildEditAction(
                ({ id }) => pageActions.updateGlobalAction(pageActionProps, id),
                'Edit Action Group Distribution',
                () => !currentOrgPermissions.canEdit,
            ),
            buildDuplicateAction(
                ({ id }) => pageActions.duplicateGlobalAction(pageActionProps, id),
                `Duplicate Action Group Distribution`,
                () => !currentOrgPermissions.canCreate,
            ),
            buildDeleteAction(
                ({ id }) => pageActions.deleteGlobalAction(pageActionProps, id),
                `Delete Action Group Distribution`,
                () => !currentOrgPermissions.canDelete,
            ),
            buildSelectAction(
                ({ id }) => router.push(toGlobalAction({ id })).then(),
                `Select Action Group Distribution`,
                () => !currentOrgPermissions.canView,
            ),
        ],

        buildFreeActions: (pageActionProps) => [
            buildAddAction(
                () => pageActions.createGlobalAction(pageActionProps, revisionId),
                'Add Global Action Group Distribution',
                () => !currentOrgPermissions.canCreate,
            ),
        ],
        buildFieldActions: () => [
            buildFieldAction(
                'name',
                ({ id }) => router.push(toGlobalAction({ id })).then(),
                `Select Tag`,
                () => !currentOrgPermissions.canView,
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
                    router.push(toAppRevision({ id }, 'global-actions')).then();
                },
            ),
    };

    return (
        <TablePage<GlobalActionsRow, GlobalActionData>
            {...globalActionGroupDistributionsPageProps}
        />
    );
};

export default GlobalActionsPage;
