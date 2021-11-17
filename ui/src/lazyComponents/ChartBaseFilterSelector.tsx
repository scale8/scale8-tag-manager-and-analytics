import { FC } from 'react';
import { AppAnalyticsContentProps } from '../types/props/AppAnalyticsContentProps';
import { QueryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { useQuery } from '@apollo/client';
import { SelectChangeEvent } from '@mui/material';
import PageAppChartBaseFilterQuery from '../gql/queries/PageAppChartBaseFilterQuery';
import { AppChartBaseData } from '../gql/generated/AppChartBaseData';
import { AppErrorContentProps } from '../types/props/AppErrorContentProps';
import { ChartBaseFilterSelectorContent } from '../components/organisms/ChartBaseFilterSelectorContent';

const ChartBaseFilterSelector: FC<AppAnalyticsContentProps | AppErrorContentProps> = (
    props: AppAnalyticsContentProps | AppErrorContentProps,
) => {
    const { appQueryOptions, id, setFilter } = props;

    return QueryLoaderAndError<AppChartBaseData>(
        false,
        useQuery<AppChartBaseData>(PageAppChartBaseFilterQuery, {
            variables: { id },
        }),
        (queryData: AppChartBaseData) => {
            const loadedEnvironments = queryData.getApp.environments;

            const currentEnvironmentKey = appQueryOptions.filter_options.environment ?? ' ';

            const handleEnvironmentChange = (e: SelectChangeEvent) => {
                if (e.target.value === ' ') {
                    setFilter('environment', undefined);
                } else {
                    setFilter('environment', e.target.value as string);
                }
            };

            const loadedRevisions = queryData.getApp.revisions;

            const currentRevisionKey = appQueryOptions.filter_options.revision ?? ' ';

            const handleRevisionChange = (e: SelectChangeEvent) => {
                if (e.target.value === ' ') {
                    setFilter('revision', undefined);
                } else {
                    setFilter('revision', e.target.value as string);
                }
            };

            return (
                <ChartBaseFilterSelectorContent
                    loadedEnvironments={loadedEnvironments}
                    currentEnvironmentKey={currentEnvironmentKey}
                    handleEnvironmentChange={handleEnvironmentChange}
                    loadedRevisions={loadedRevisions}
                    currentRevisionKey={currentRevisionKey}
                    handleRevisionChange={handleRevisionChange}
                />
            );
        },
        true,
        <></>,
        () => <></>,
    );
};

export default ChartBaseFilterSelector;
