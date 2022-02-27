import { TimeSlice } from '../../gql/generated/globalTypes';
import { useEffect, useState } from 'react';
import {
    ChartPeriodProps,
    chartPeriodToFilterRange,
    chartPeriodToFilterRangePrev,
    timeSliceFromPeriodType,
} from './useChartPeriod';

export interface QueryFilterOptions {
    from: S8DateTime;
    to: S8DateTime;
    [filterKey: string]: any;
}

export interface QueryOptions {
    time_slice?: TimeSlice | null;
    filter_options: QueryFilterOptions;
    limit?: number | null;
}

export const useQueryOptions = (
    chartPeriodProps: ChartPeriodProps,
    filters?: { [filterKey: string]: any },
) => {
    const [queryOptions, setQueryOptions] = useState<QueryOptions | undefined>(undefined);

    const [summaryQueryOptions, setSummaryQueryOptions] = useState<QueryOptions | undefined>(
        undefined,
    );

    const [summaryQueryOptionsPrev, setSummaryQueryOptionsPrev] = useState<
        QueryOptions | undefined
    >(undefined);

    const [summaryQueryOptionsCurrent, setSummaryQueryOptionsCurrent] = useState<
        QueryOptions | undefined
    >(undefined);

    const { period, date, from, to } = chartPeriodProps;

    useEffect(() => {
        setQueryOptions({
            time_slice: timeSliceFromPeriodType(period),
            filter_options: {
                ...chartPeriodToFilterRange({
                    period,
                    date,
                    from,
                    to,
                }),
                ...filters,
            },
        });
        setSummaryQueryOptions({
            time_slice: TimeSlice.YEAR,
            filter_options: {
                ...chartPeriodToFilterRange({
                    period,
                    date,
                    from,
                    to,
                }),
                ...filters,
            },
        });
        setSummaryQueryOptionsPrev({
            time_slice: TimeSlice.YEAR,
            filter_options: {
                ...chartPeriodToFilterRangePrev({
                    period,
                    date,
                    from,
                    to,
                }),
                ...filters,
            },
        });
        setSummaryQueryOptionsCurrent({
            time_slice: TimeSlice.YEAR,
            filter_options: {
                from: '-300s',
                to: '0s',
            },
        });
    }, [period, date, from, to, filters]);

    return {
        queryOptions,
        summaryQueryOptions,
        summaryQueryOptionsPrev,
        summaryQueryOptionsCurrent,
    };
};
