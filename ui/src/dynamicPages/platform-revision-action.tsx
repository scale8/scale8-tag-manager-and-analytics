import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import { DynamicPageProps } from '../pageLoader/DynamicPageLoader';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { PagePlatformActionDataMapsData } from '../gql/generated/PagePlatformActionDataMapsData';
import PagePlatformActionDataMapsQuery from '../gql/queries/PagePlatformActionDataMapsQuery';
import {
    DataMapsTable,
    dataMapsToTableData,
    SourceDataMap,
} from '../components/molecules/DataMapsTable';
import PageTitle from '../components/molecules/PageTitle';
import { buildStandardMainInfo } from '../utils/InfoLabelsUtils';

const PlatformRevisionAction: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const actionId = props.params.id ?? '';

    return queryLoaderAndError<PagePlatformActionDataMapsData>(
        true,
        useQuery<PagePlatformActionDataMapsData>(PagePlatformActionDataMapsQuery, {
            variables: { id: actionId },
        }),
        (data: PagePlatformActionDataMapsData) => {
            const tableData = dataMapsToTableData(
                data.getPlatformAction.platform_data_maps as SourceDataMap[],
            );

            return (
                <Box mb={4}>
                    <Box mx={2}>
                        <PageTitle
                            title="Action Data Maps"
                            {...buildStandardMainInfo('platformActionDataMaps')}
                        />
                    </Box>
                    <DataMapsTable
                        isPlatform={true}
                        tableData={tableData ?? []}
                        editable={false}
                        contained={false}
                    />
                </Box>
            );
        },
    );
};

export default PlatformRevisionAction;
