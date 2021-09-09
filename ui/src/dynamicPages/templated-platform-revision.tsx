import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { DynamicPageProps } from '../pageLoader/DynamicPageLoader';
import { useLoggedInState } from '../context/AppContext';
import { extractPermissionsFromOrgUser } from '../context/OrgUserReducer';
import { PageActionProps, pageActions } from '../actions/PageActions';
import { TablePage, TablePageProps } from '../abstractions/TablePage';
import { TemplatedActionPageData } from '../gql/generated/TemplatedActionPageData';
import { buildStandardMainInfo, buildTableColumns } from '../utils/InfoLabelsUtils';
import PageTemplatedActionQuery from '../gql/queries/PageTemplatedActionQuery';
import {
    buildAddAction,
    buildDeleteAction,
    buildEditAction,
    buildFieldAction,
    buildPreviewAction,
} from '../utils/TableActionsUtils';
import { toTemplatedPlatformRevision } from '../utils/NavigationPaths';

type TemplatedActionTableRow = {
    id: string;
    name: string;
    description: string;
    dataMaps: number;
    revisionLocked: boolean;
};

const TemplatedActionsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const revisionId = props.params.id ?? '';

    const router = useRouter();
    const { orgUserState, templateInteractions } = useLoggedInState();
    const { ask, dispatchDialogAction } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
        refresh: () => {
            // no need to refresh
        },
    };

    const templatedActionsPageProps: TablePageProps<
        TemplatedActionTableRow,
        TemplatedActionPageData
    > = {
        title: 'Actions',
        mainInfoProps: buildStandardMainInfo('templatedActions'),
        mainQuery: useQuery<TemplatedActionPageData>(PageTemplatedActionQuery, {
            variables: { id: revisionId },
        }),
        tableId: 'TemplatedActions',
        entityName: 'Action',
        columns: buildTableColumns('templatedActions', [
            { field: 'name' },
            { field: 'id' },
            { field: 'description' },
            { field: 'dataMaps', type: 'numeric' },
        ]),
        defaultOrderBy: 'id',
        defaultOrder: 'desc',
        mapTableData: (data) =>
            data.getPlatformRevision.platform_actions.map(
                (platformAction): TemplatedActionTableRow => {
                    return {
                        id: platformAction.id,
                        name: platformAction.name,
                        description: platformAction.description,
                        dataMaps: platformAction.platform_data_maps.length,
                        revisionLocked: data.getPlatformRevision.locked,
                    };
                },
            ),
        buildRowActions: (pageActionProps) => [
            buildPreviewAction(
                ({ id }) => pageActions.inspectTemplatedAction(pageActionProps, id),
                'Inspect Action',
                () => !currentOrgPermissions.canView,
                (data) => !data.revisionLocked,
            ),
            buildDeleteAction(
                ({ name, id }) =>
                    ask(`Delete Action: ${name}?`, () => {
                        pageActions.deleteTemplatedAction(pageActionProps, id);
                    }),
                `Delete Action`,
                (data) => !currentOrgPermissions.canDelete || data.revisionLocked,
            ),
            buildEditAction(
                ({ id }) => pageActions.updateTemplatedAction(pageActionProps, id),
                'Edit Action',
                () => !currentOrgPermissions.canEdit,
                (data) => data.revisionLocked,
            ),
        ],
        buildFieldActions: (pageActionProps) => [
            buildFieldAction(
                'name',
                ({ id }) => pageActions.updateTemplatedAction(pageActionProps, id),
                'Edit Action',
                () => !currentOrgPermissions.canEdit,
            ),
        ],
        buildFreeActions: (pageActionProps) => [
            buildAddAction(
                () => pageActions.createTemplatedAction(pageActionProps, revisionId),
                'Create Templated Action',
                () => !currentOrgPermissions.canCreate,
            ),
        ],
        tableLockOnRevision: (data) => data.getPlatformRevision.locked,
        buildTableRevisionCloneAction: (data) => () =>
            pageActions.duplicatePlatformRevision(
                pageActionProps,
                data.getPlatformRevision.id,
                (
                    id: string,
                    pageRefresh: () => void,
                    handleDialogClose: (checkChanges: boolean) => void,
                ) => {
                    handleDialogClose(false);
                    router.push(toTemplatedPlatformRevision({ id })).then();
                },
            ),
    };

    return (
        <TablePage<TemplatedActionTableRow, TemplatedActionPageData>
            {...templatedActionsPageProps}
        />
    );
};

export default TemplatedActionsPage;
