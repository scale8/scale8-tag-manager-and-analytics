import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from '@material-ui/core';
import { DynamicPageProps } from '../pageLoader/DynamicPageLoader';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { PlatformDataContainerDataMapsData } from '../gql/generated/PlatformDataContainerDataMapsData';
import PagePlatformDataContainerDataMapsQuery from '../gql/queries/PagePlatformDataContainerDataMapsQuery';
import {
    DataMapsTable,
    dataMapsToTableData,
    SourceDataMap,
} from '../components/molecules/DataMapsTable';
import PageTitle from '../components/molecules/PageTitle';
import { buildStandardMainInfo } from '../utils/InfoLabelsUtils';

const PlatformDataContainerDataMapsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const dataContainerId = props.params.id ?? '';

    return queryLoaderAndError<PlatformDataContainerDataMapsData>(
        true,
        useQuery<PlatformDataContainerDataMapsData>(PagePlatformDataContainerDataMapsQuery, {
            variables: { id: dataContainerId },
        }),
        (data: PlatformDataContainerDataMapsData) => {
            const tableData = dataMapsToTableData(
                data.getPlatformDataContainer.platform_data_maps as SourceDataMap[],
            );

            return (
                <Box mb={4}>
                    <Box mx={2}>
                        <PageTitle
                            title="Container Data Maps"
                            {...buildStandardMainInfo('platformDataContainerDataMaps')}
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

export default PlatformDataContainerDataMapsPage;
