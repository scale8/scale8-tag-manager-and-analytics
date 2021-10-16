import { FC } from 'react';
import { Box } from '@mui/material';
import { Alert } from '@mui/material';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { DynamicPageProps } from '../pageLoader/DynamicPageLoader';
import { useLoggedInState } from '../context/AppContext';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { IngestEndpointDataMapPageData } from '../gql/generated/IngestEndpointDataMapPageData';
import PageIngestEndpointDataMapQuery from '../gql/queries/PageIngestEndpointDataMapQuery';
import {
    DataMapsTable,
    dataMapsToTableData,
    SourceDataMap,
} from '../components/molecules/DataMapsTable';
import { PageActionProps, pageActions } from '../actions/PageActions';
import PageTitle from '../components/molecules/PageTitle';
import { buildStandardMainInfo } from '../utils/InfoLabelsUtils';
import { toIngestEndpointRevision } from '../utils/NavigationPaths';

const IngestEndpointDataMapsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const revisionId = props.params.id ?? '';

    const router = useRouter();
    const { templateInteractions } = useLoggedInState();
    const { ask, dispatchDialogAction } = templateInteractions;

    return queryLoaderAndError<IngestEndpointDataMapPageData>(
        true,
        useQuery(PageIngestEndpointDataMapQuery, {
            variables: { id: revisionId },
        }),
        (data: IngestEndpointDataMapPageData, valuesRefresh: (mustResetCache: boolean) => void) => {
            const tableData = dataMapsToTableData(
                data.getIngestEndpointRevision.ingest_endpoint_data_maps as SourceDataMap[],
            );

            const pageActionProps: PageActionProps = {
                dispatchDialogAction,
                refresh: (mustResetTable: boolean, mustResetCache: boolean) => {
                    valuesRefresh(mustResetCache);
                },
            };

            const locked = data.getIngestEndpointRevision.locked;

            const deleteHandler = (dataMapId: string, dataMapName: string) => {
                ask(`Remove Data Map: ${dataMapName}?`, () => {
                    pageActions.deleteDataIngestEndpointMap(pageActionProps, dataMapId);
                });
            };

            const updateHandler = (dataMapId: string) => {
                pageActions.updateDataIngestEndpointMap(pageActionProps, dataMapId);
            };

            const inspectHandler = (dataMapId: string) => {
                pageActions.inspectDataIngestEndpointMap(pageActionProps, dataMapId);
            };

            const createHandler = (level: number, dataMapId?: string, dataMapName?: string) => {
                pageActions.createDataIngestEndpointMap(
                    pageActionProps,
                    level,
                    revisionId,
                    dataMapId,
                    dataMapName,
                );
            };

            return (
                <Box>
                    {locked && (
                        <Alert severity="warning">
                            This revision has been marked as final. No further changes are possible.
                            Please{' '}
                            <span
                                style={{
                                    color: 'inherit',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    pageActions.duplicateIngestEndpointRevision(
                                        pageActionProps,
                                        revisionId,
                                        (
                                            id: string,
                                            pageRefresh: () => void,
                                            handleDialogClose: (checkChanges: boolean) => void,
                                        ) => {
                                            handleDialogClose(false);
                                            router.push(toIngestEndpointRevision({ id })).then();
                                        },
                                    );
                                }}
                            >
                                <b>clone</b>
                            </span>{' '}
                            the revision to continue working on it.
                        </Alert>
                    )}
                    <Box mb={4}>
                        <Box mx={2}>
                            <PageTitle
                                title="Data Structure"
                                {...buildStandardMainInfo('ingestEndpointDataMaps')}
                            />
                        </Box>
                        <DataMapsTable
                            isPlatform={false}
                            tableData={tableData ?? []}
                            editable={!locked}
                            contained={false}
                            deleteHandler={deleteHandler}
                            createHandler={createHandler}
                            updateHandler={updateHandler}
                            inspectHandler={inspectHandler}
                        />
                    </Box>
                </Box>
            );
        },
    );
};

export default IngestEndpointDataMapsPage;
