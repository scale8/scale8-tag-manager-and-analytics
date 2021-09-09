import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { TableRowBase } from '../types/TableRow';
import { useRouter } from 'next/router';
import { DynamicPageProps } from '../pageLoader/DynamicPageLoader';
import { useLoggedInState } from '../context/AppContext';
import { extractPermissionsFromOrgUser } from '../context/OrgUserReducer';
import { TablePage, TablePageProps } from '../abstractions/TablePage';
import PageIngestEndpointQuery from '../gql/queries/PageIngestEndpointQuery';
import { buildStandardMainInfo, buildTableColumns } from '../utils/InfoLabelsUtils';
import { buildSparkQueryOptions, groupingCountToSparkData } from '../utils/SparkDataUtils';
import { extractBaseColumns } from '../utils/TableRowUtils';
import { pageActions } from '../actions/PageActions';
import {
    buildAddAction,
    buildDeleteAction,
    buildEditAction,
    buildFieldAction,
    buildSelectAction,
} from '../utils/TableActionsUtils';
import { IngestEndpointPageData } from '../gql/generated/IngestEndpointPageData';
import { toIngestEndpoint } from '../utils/NavigationPaths';

export type IngestEndpointTableRow = TableRowBase & {
    name: string;
    revisions: number;
    environments: number;
    bytes: number[];
    requests: number[];
};

const IngestEndpointsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const dataManagerId = props.params.id ?? '';

    const router = useRouter();
    const { orgUserState, templateInteractions } = useLoggedInState();
    const { ask } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const ingestEndpointPageProps: TablePageProps<IngestEndpointTableRow, IngestEndpointPageData> =
        {
            title: 'Ingest Endpoints',
            mainInfoProps: buildStandardMainInfo('ingestEndpoints'),
            mainQuery: useQuery(PageIngestEndpointQuery, {
                variables: {
                    id: dataManagerId,
                    ingestQueryOptions: buildSparkQueryOptions(true),
                },
            }),
            tableId: 'IngestEndpoints',
            entityName: 'Ingest Endpoint',
            columns: buildTableColumns('ingestEndpoints', [
                { field: 'name' },
                { field: 'id' },
                { field: 'requests', type: 'graph' },
                { field: 'bytes', type: 'graph' },
                { field: 'revisions', type: 'numeric', hidden: true },
                { field: 'environments', type: 'numeric', hidden: true },
                { field: 'updatedAt' },
                { field: 'createdAt' },
            ]),
            mapTableData: (data) =>
                data.getDataManagerAccount.ingest_endpoints.map(
                    (ingestEndpoint): IngestEndpointTableRow => {
                        return {
                            ...extractBaseColumns(ingestEndpoint),
                            name: ingestEndpoint.name,
                            bytes: groupingCountToSparkData(
                                ingestEndpoint.byte_stats.from as number,
                                ingestEndpoint.byte_stats.to as number,
                                ingestEndpoint.byte_stats.result,
                            ),
                            requests: groupingCountToSparkData(
                                ingestEndpoint.request_stats.from as number,
                                ingestEndpoint.request_stats.to as number,
                                ingestEndpoint.request_stats.result,
                            ),
                            revisions: ingestEndpoint.ingest_endpoint_revisions.length,
                            environments: ingestEndpoint.ingest_endpoint_environments.length,
                        };
                    },
                ),
            buildRowActions: (pageActionProps) => [
                buildEditAction(
                    ({ id }) => pageActions.updateIngestEndpoint(pageActionProps, id),
                    'Edit Ingest Endpoint',
                    () => !currentOrgPermissions.canEdit,
                ),
                buildDeleteAction(
                    ({ name, id }) =>
                        ask(`Delete Ingest Endpoint: ${name}?`, () => {
                            pageActions.deleteIngestEndpoint(pageActionProps, id);
                        }),
                    `Delete Ingest Endpoint`,
                    () => !currentOrgPermissions.canDelete,
                ),
                buildSelectAction(
                    ({ id }) => router.push(toIngestEndpoint({ id })).then(),
                    `Select Ingest Endpoint`,
                    () => !currentOrgPermissions.canView,
                ),
            ],
            buildFreeActions: (pageActionProps) => [
                buildAddAction(
                    () => pageActions.createIngestEndpoint(pageActionProps, dataManagerId),
                    'Add Ingest Endpoint',
                    () => !currentOrgPermissions.canCreate,
                ),
            ],
            buildFieldActions: () => [
                buildFieldAction(
                    'name',
                    ({ id }) => router.push(toIngestEndpoint({ id })).then(),
                    `Select Ingest Endpoint`,
                    () => !currentOrgPermissions.canView,
                ),
            ],
            buildEmptyAction: (pageActionProps) => ({
                onClick: () => pageActions.createIngestEndpoint(pageActionProps, dataManagerId),
                text: 'Create your first Ingest Endpoint',
            }),
        };

    return (
        <TablePage<IngestEndpointTableRow, IngestEndpointPageData> {...ingestEndpointPageProps} />
    );
};

export default IngestEndpointsPage;
