import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import { DynamicPageProps } from '../pageLoader/DynamicPageLoader';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { PlatformEventsDataMapsData } from '../gql/generated/PlatformEventsDataMapsData';
import PagePlatformEventsDataMapsQuery from '../gql/queries/PagePlatformEventsDataMapsQuery';
import {
    DataMapsTable,
    dataMapsToTableData,
    SourceDataMap,
} from '../components/molecules/DataMapsTable';
import PageTitle from '../components/molecules/PageTitle';
import { buildStandardMainInfo } from '../utils/InfoLabelsUtils';

const PlatformEventDataMapsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const dataContainerId = props.params.id ?? '';

    return queryLoaderAndError<PlatformEventsDataMapsData>(
        true,
        useQuery<PlatformEventsDataMapsData>(PagePlatformEventsDataMapsQuery, {
            variables: { id: dataContainerId },
        }),
        (data: PlatformEventsDataMapsData) => {
            const tableData = dataMapsToTableData(
                data.getPlatformEvent.platform_data_maps as SourceDataMap[],
            );

            return (
                <>
                    <Box mb={4}>
                        <Box mx={2}>
                            <PageTitle
                                title="Container Data Maps"
                                {...buildStandardMainInfo('platformEventDataMaps')}
                            />
                        </Box>
                        <DataMapsTable
                            isPlatform={true}
                            tableData={tableData ?? []}
                            editable={false}
                            contained={false}
                        />
                    </Box>
                </>
            );
        },
    );
};

export default PlatformEventDataMapsPage;
