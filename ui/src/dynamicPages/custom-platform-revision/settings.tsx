import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import { queryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { PlatformSettingPageData } from '../../gql/generated/PlatformSettingPageData';
import PagePlatformSettingQuery from '../../gql/queries/PagePlatformSettingQuery';
import {
    DataMapsTable,
    dataMapsToTableData,
    SourceDataMap,
} from '../../components/molecules/DataMapsTable';
import PageTitle from '../../components/molecules/PageTitle';
import { buildStandardMainInfo } from '../../utils/InfoLabelsUtils';

const PlatformSettingsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const revisionId = props.params.id ?? '';

    return queryLoaderAndError<PlatformSettingPageData>(
        true,
        useQuery<PlatformSettingPageData>(PagePlatformSettingQuery, {
            variables: { id: revisionId },
        }),
        (data: PlatformSettingPageData) => {
            const tableData = dataMapsToTableData(
                data.getPlatformRevision.platform_settings as SourceDataMap[],
            );

            return (
                <Box mb={4}>
                    <Box mx={2}>
                        <PageTitle
                            title="Settings"
                            {...buildStandardMainInfo('platformSettings')}
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

export default PlatformSettingsPage;
