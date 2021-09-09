import { FC } from 'react';
import { toIngestEndpointRevision } from '../../utils/NavigationPaths';
import { useQuery } from '@apollo/client';
import PageIngestEndpointRevisionQuery from '../../gql/queries/PageIngestEndpointRevisionQuery';
import { IngestEndpointRevisionPageData } from '../../gql/generated/IngestEndpointRevisionPageData';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import {
    buildCompareAction,
    buildDuplicateAction,
    buildEditAction,
    buildFieldAction,
    buildFinaliseAction,
    buildHistoryAction,
    buildPayloadPreviewAction,
    buildSelectAction,
} from '../../utils/TableActionsUtils';
import { pageActions } from '../../actions/PageActions';
import { buildSparkQueryOptions, groupingCountToSparkData } from '../../utils/SparkDataUtils';
import { TableRowBase } from '../../types/TableRow';
import { extractBaseColumns } from '../../utils/TableRowUtils';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { useRouter } from 'next/router';
import { useLoggedInState } from '../../context/AppContext';

export type IngestEndpointRevisionTableRow = TableRowBase & {
    name: string;
    bytes: number[];
    requests: number[];
    ingestEndpointDataMaps: number;
    locked: boolean;
};

const IngestEndpointRevisionsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const ingestEndpointId = props.params.id ?? '';

    const router = useRouter();
    const { orgUserState, templateInteractions } = useLoggedInState();
    const { ask } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const ingestEndpointRevisionTablePageProps: TablePageProps<
        IngestEndpointRevisionTableRow,
        IngestEndpointRevisionPageData
    > = {
        title: 'Ingest Endpoint Revisions',
        mainQuery: useQuery(PageIngestEndpointRevisionQuery, {
            variables: {
                id: ingestEndpointId,
                ingestQueryOptions: buildSparkQueryOptions(true),
            },
        }),
        mainInfoProps: buildStandardMainInfo('ingestEndpointRevisions'),
        tableId: 'IngestEndpointRevisions',
        entityName: 'Revision',
        columns: buildTableColumns('ingestEndpointRevisions', [
            { field: 'name' },
            { field: 'id' },
            { field: 'requests', type: 'graph' },
            { field: 'bytes', type: 'graph' },
            {
                title: 'Data Maps',
                field: 'ingestEndpointDataMaps',
                type: 'numeric',
                hidden: true,
            },
            { field: 'locked', type: 'boolean' },
            { field: 'updatedAt' },
            { field: 'createdAt' },
        ]),
        mapTableData: (data) =>
            data.getIngestEndpoint.ingest_endpoint_revisions.map(
                (ingestEndpointRevision): IngestEndpointRevisionTableRow => {
                    return {
                        ...extractBaseColumns(ingestEndpointRevision),
                        name: ingestEndpointRevision.name,
                        bytes: groupingCountToSparkData(
                            ingestEndpointRevision.byte_stats.from as number,
                            ingestEndpointRevision.byte_stats.to as number,
                            ingestEndpointRevision.byte_stats.result,
                        ),
                        requests: groupingCountToSparkData(
                            ingestEndpointRevision.request_stats.from as number,
                            ingestEndpointRevision.request_stats.to as number,
                            ingestEndpointRevision.request_stats.result,
                        ),
                        ingestEndpointDataMaps:
                            ingestEndpointRevision.ingest_endpoint_data_maps.length,
                        locked: ingestEndpointRevision.locked,
                    };
                },
            ),

        buildRowActions: (pageActionProps) => [
            buildPayloadPreviewAction(
                ({ id }) => pageActions.previewIngestEndpointRevisionPayload(pageActionProps, id),
                'Payload Build Preview',
                () => !currentOrgPermissions.canView,
            ),
            buildHistoryAction(
                ({ id, name }) =>
                    pageActions.showIngestEndpointRevisionHistory(pageActionProps, id, name),
                'Revision History',
                () => !currentOrgPermissions.canView,
            ),
            buildEditAction(
                ({ id }) => pageActions.updateIngestEndpointRevision(pageActionProps, id),
                'Edit Revision',
                () => !currentOrgPermissions.canEdit,
            ),
            buildDuplicateAction(
                ({ id }) =>
                    pageActions.duplicateIngestEndpointRevision(
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
                        pageActions.finaliseIngestEndpointRevision(pageActionProps, id);
                    }),
                `Finalise Revision`,
                ({ locked }) => !currentOrgPermissions.canEdit || locked,
            ),
            buildSelectAction(
                ({ id }) => router.push(toIngestEndpointRevision({ id })).then(),
                `Select Revision`,
                () => !currentOrgPermissions.canView,
            ),
        ],
        buildFieldActions: () => [
            buildFieldAction(
                'name',
                ({ id }) => router.push(toIngestEndpointRevision({ id })).then(),
                `Select Revision`,
                () => !currentOrgPermissions.canView,
            ),
        ],
        buildCoupleActions: (pageActionProps) => [
            buildCompareAction((leftId: string, rightId: string) => {
                pageActions.compareIngestEndpointRevisions(pageActionProps, leftId, rightId);
            }, `Compare Revisions`),
        ],
    };

    return (
        <TablePage<IngestEndpointRevisionTableRow, IngestEndpointRevisionPageData>
            {...ingestEndpointRevisionTablePageProps}
        />
    );
};

export default IngestEndpointRevisionsPage;
