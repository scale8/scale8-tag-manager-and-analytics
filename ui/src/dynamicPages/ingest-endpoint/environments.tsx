import { FC } from 'react';
import { useQuery } from '@apollo/client';
import PageIngestEndpointEnvironmentQuery from '../../gql/queries/PageIngestEndpointEnvironmentQuery';
import { IngestEndpointEnvironmentPageData } from '../../gql/generated/IngestEndpointEnvironmentPageData';
import { Mode } from '../../gql/generated/globalTypes';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import {
    buildAddAction,
    buildDeleteAction,
    buildEditAction,
    buildEditCustomDomainAction,
    buildFieldAction,
    buildHistoryAction,
    buildInstallInstructionsAction,
} from '../../utils/TableActionsUtils';
import { pageActions } from '../../actions/PageActions';
import { buildSparkQueryOptions, groupingCountToSparkData } from '../../utils/SparkDataUtils';
import { TableRowBase } from '../../types/TableRow';
import { extractBaseColumns } from '../../utils/TableRowUtils';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { getStorageProviderLabel } from '../../utils/StorageProviderUtils';

export type IngestEndpointEnvironmentTableRow = TableRowBase & {
    name: string;
    bytes: number[];
    requests: number[];
    revision: string;
    customDomain: string;
    installDomain: string;
    configHint: string;
    storageProvider: string;
};

const IngestEndpointEnvironmentsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const ingestEndpointId = props.params.id ?? '';

    const { orgUserState, templateInteractions } = useLoggedInState();
    const { mode, isAuditEnabled } = useConfigState();
    const { ask } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const ingestEndpointEnvironmentPageProps: TablePageProps<
        IngestEndpointEnvironmentTableRow,
        IngestEndpointEnvironmentPageData
    > = {
        title: 'Environments',
        mainQuery: useQuery(PageIngestEndpointEnvironmentQuery, {
            variables: {
                id: ingestEndpointId,
                ingestQueryOptions: buildSparkQueryOptions(true),
            },
        }),
        mainInfoProps: buildStandardMainInfo('ingestEndpointEnvironments'),
        tableId: 'IngestEndpointEnvironments',
        entityName: 'Environment',
        columns: buildTableColumns(
            'ingestEndpointEnvironments',
            mode === Mode.COMMERCIAL
                ? [
                      { field: 'name' },
                      { field: 'id' },
                      { field: 'requests', type: 'graph', hidden: true },
                      { field: 'bytes', type: 'graph', hidden: true },
                      { field: 'customDomain' },
                      { field: 'installDomain' },
                      { field: 'revision' },
                      { field: 'storageProvider' },
                      { title: 'Config', field: 'configHint', type: 'string' },
                      { field: 'updatedAt' },
                      { field: 'createdAt', hidden: true },
                  ]
                : [
                      { field: 'name' },
                      { field: 'id' },
                      { field: 'requests', type: 'graph', hidden: true },
                      { field: 'bytes', type: 'graph', hidden: true },
                      { field: 'revision' },
                      { field: 'storageProvider' },
                      { title: 'Config', field: 'configHint', type: 'string' },
                      { field: 'updatedAt' },
                      { field: 'createdAt', hidden: true },
                  ],
        ),
        mapTableData: (data) =>
            data.getIngestEndpoint.ingest_endpoint_environments.map(
                (ingestEndpointEnvironment): IngestEndpointEnvironmentTableRow => {
                    return {
                        ...extractBaseColumns(ingestEndpointEnvironment),
                        name: ingestEndpointEnvironment.name,
                        bytes: groupingCountToSparkData(
                            ingestEndpointEnvironment.byte_stats.from as number,
                            ingestEndpointEnvironment.byte_stats.to as number,
                            ingestEndpointEnvironment.byte_stats.result,
                        ),
                        requests: groupingCountToSparkData(
                            ingestEndpointEnvironment.request_stats.from as number,
                            ingestEndpointEnvironment.request_stats.to as number,
                            ingestEndpointEnvironment.request_stats.result,
                        ),
                        revision: ingestEndpointEnvironment.ingest_endpoint_revision
                            ? ingestEndpointEnvironment.ingest_endpoint_revision.name
                            : '-',
                        customDomain: ingestEndpointEnvironment.custom_domain
                            ? ingestEndpointEnvironment.custom_domain
                            : 'Create custom domain',
                        installDomain: ingestEndpointEnvironment.install_domain
                            ? ingestEndpointEnvironment.install_domain
                            : '-',
                        configHint: ingestEndpointEnvironment.config_hint,
                        storageProvider: getStorageProviderLabel(
                            ingestEndpointEnvironment.storage_provider,
                        ),
                    };
                },
            ),

        buildRowActions: (pageActionProps) => [
            ...[
                buildInstallInstructionsAction(
                    ({ id }) => pageActions.installIngestEndpointEnvironment(pageActionProps, id),
                    'Install Environment',
                    () => !currentOrgPermissions.canView,
                ),
                buildHistoryAction(
                    ({ id, name }) =>
                        pageActions.showIngestEndpointEnvironmentHistory(pageActionProps, id, name),
                    'Environment History',
                    () => !currentOrgPermissions.canView,
                    () => !isAuditEnabled,
                ),
            ],
            ...(mode === Mode.COMMERCIAL
                ? [
                      buildEditCustomDomainAction(
                          ({ id }) =>
                              pageActions.editCustomDomainIngestEndpointEnvironment(
                                  pageActionProps,
                                  id,
                              ),
                          'Custom Domain',
                          () => !currentOrgPermissions.canEdit,
                      ),
                  ]
                : []),
            ...[
                buildEditAction(
                    ({ id }) =>
                        pageActions.updateIngestEndpointEnvironment(
                            pageActionProps,
                            id,
                            ingestEndpointId,
                        ),
                    'Edit Environment',
                    () => !currentOrgPermissions.canEdit,
                ),
                buildDeleteAction(
                    ({ name, id }) =>
                        ask(`Delete Environment: ${name}?`, () => {
                            pageActions.deleteIngestEndpointEnvironment(pageActionProps, id);
                        }),
                    `Delete Environment`,
                    () => !currentOrgPermissions.canDelete,
                ),
            ],
        ],
        buildFieldActions: (pageActionProps) => [
            buildFieldAction(
                'name',
                ({ id }) =>
                    pageActions.updateIngestEndpointEnvironment(
                        pageActionProps,
                        id,
                        ingestEndpointId,
                    ),
                'Edit Environment',
                () => !currentOrgPermissions.canEdit,
            ),
            buildFieldAction(
                'customDomain',
                ({ id }) =>
                    pageActions.editCustomDomainIngestEndpointEnvironment(pageActionProps, id),
                '',
                () => !currentOrgPermissions.canEdit,
            ),
        ],
        buildFreeActions: (pageActionProps) => [
            buildAddAction(
                () =>
                    pageActions.createIngestEndpointEnvironment(pageActionProps, ingestEndpointId),
                'Add Environment',
                () => !currentOrgPermissions.canCreate,
            ),
        ],
    };

    return (
        <TablePage<IngestEndpointEnvironmentTableRow, IngestEndpointEnvironmentPageData>
            {...ingestEndpointEnvironmentPageProps}
        />
    );
};

export default IngestEndpointEnvironmentsPage;
