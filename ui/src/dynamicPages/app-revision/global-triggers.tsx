import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { useLoggedInState } from '../../context/AppContext';
import { useRouter } from 'next/router';
import { TableRowBase } from '../../types/TableRow';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import { PageActionProps, pageActions } from '../../actions/PageActions';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { GlobalTriggerData } from '../../gql/generated/GlobalTriggerData';
import PageGlobalTriggerQuery from '../../gql/queries/PageGlobalTriggerQuery';
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
import { toAppRevision, toGlobalTrigger } from '../../utils/NavigationPaths';

export type GlobalTriggerTableRow = TableRowBase & {
    name: string;
    events: number;
    conditionRules: number;
    exceptionRules: number;
};

const GlobalTriggersPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const revisionId = props.params.id ?? '';

    const router = useRouter();
    const { templateInteractions, orgUserState } = useLoggedInState();
    const { dispatchDialogAction } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
        refresh: () => {
            // no need to refresh
        },
    };

    const globalTriggersPageProps: TablePageProps<GlobalTriggerTableRow, GlobalTriggerData> = {
        title: 'Global Triggers',
        mainQuery: useQuery(PageGlobalTriggerQuery, {
            variables: { id: revisionId },
        }),
        tableId: 'GlobalTriggers',
        entityName: 'Global Trigger',
        mainInfoProps: buildStandardMainInfo('globalTriggers'),
        columns: buildTableColumns('globalTriggers', [
            { field: 'name' },
            { field: 'id' },
            { field: 'events', type: 'numeric' },
            { field: 'conditionRules', type: 'numeric' },
            { field: 'exceptionRules', type: 'numeric' },
            { field: 'updatedAt' },
            { field: 'createdAt' },
        ]),
        mapTableData: (data) =>
            data.getRevision.global_triggers.map((trigger): GlobalTriggerTableRow => {
                return {
                    ...extractBaseColumns(trigger),
                    name: trigger.name,
                    events: trigger.events.length,
                    conditionRules: trigger.condition_rules.length,
                    exceptionRules: trigger.exception_rules.length,
                };
            }),

        buildRowActions: (pageActionProps) => [
            buildHistoryAction(
                ({ id, name }) => pageActions.showGlobalTriggerHistory(pageActionProps, id, name),
                'Trigger History',
                () => !currentOrgPermissions.canView,
            ),
            buildEditAction(
                ({ id }) => pageActions.updateGlobalTrigger(pageActionProps, id),
                'Edit Trigger',
                () => !currentOrgPermissions.canEdit,
            ),
            buildDuplicateAction(
                ({ id }) => pageActions.duplicateGlobalTrigger(pageActionProps, id),
                `Duplicate Trigger`,
                () => !currentOrgPermissions.canCreate,
            ),
            buildDeleteAction(
                ({ id }) => pageActions.deleteGlobalTrigger(pageActionProps, id),
                `Delete Trigger`,
                () => !currentOrgPermissions.canDelete,
            ),
            buildSelectAction(
                ({ id }) => router.push(toGlobalTrigger({ id })).then(),
                `Select Trigger`,
                () => !currentOrgPermissions.canView,
            ),
        ],

        buildFreeActions: (pageActionProps) => [
            buildAddAction(
                () => pageActions.createGlobalTrigger(pageActionProps, revisionId),
                'Add Global Trigger',
                () => !currentOrgPermissions.canCreate,
            ),
        ],
        buildFieldActions: () => [
            buildFieldAction(
                'name',
                ({ id }) => router.push(toGlobalTrigger({ id })).then(),
                `Select Trigger`,
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
                    router.push(toAppRevision({ id }, 'global-triggers')).then();
                },
            ),
    };

    return <TablePage<GlobalTriggerTableRow, GlobalTriggerData> {...globalTriggersPageProps} />;
};

export default GlobalTriggersPage;
