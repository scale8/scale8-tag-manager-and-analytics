import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TimeSlice } from '../../gql/generated/globalTypes';
import {
    addDaysUTC,
    addHoursUTC,
    addMinutesUTC,
    addMonthsUTC,
    differenceDaysUTC,
    displayDayDetails,
    displayFullMonth,
    displayHourDetails,
    endOfDayFromTimestamp,
    endOfMonthFromTimestamp,
    getDaysInMonthFromTimestamp,
    isSameMinuteTimestamp,
    startOfDayFromTimestamp,
    startOfMonthFromTimestamp,
    startOfTodayUTC,
    stringToUTCTimestamp,
    subDaysUTC,
    subMonthsUTC,
    UTCNow,
    UTCTimestamp,
} from '../../utils/DateTimeUtils';
import { AppGroupingCount, GroupingCount } from '../../utils/AnalyticsUtils';

export type ChartPeriodType =
    | 'day'
    | 'realtime'
    | '7d'
    | '30d'
    | 'month'
    | '6mo'
    | '12mo'
    | 'custom';

export type ChartPeriod = {
    period: ChartPeriodType;
    date?: UTCTimestamp;
    from?: UTCTimestamp;
    to?: UTCTimestamp;
};

export type ChartPeriodSetters = {
    setPeriod: Dispatch<SetStateAction<ChartPeriodType>>;
    setDate: Dispatch<SetStateAction<UTCTimestamp | undefined>>;
    setFrom: Dispatch<SetStateAction<UTCTimestamp | undefined>>;
    setTo: Dispatch<SetStateAction<UTCTimestamp | undefined>>;
};

export type ChartPeriodProps = ChartPeriod & ChartPeriodSetters;

type GraphName = 'analytics' | 'errors' | 'endpoint';

const buildSessionStorageKey = (graphName: GraphName) => `${graphName}-chart-period-params`;

const getChartPeriodSessionParams = (
    graphName: GraphName,
):
    | {
          period: ChartPeriodType;
          date?: UTCTimestamp;
          from?: UTCTimestamp;
          to?: UTCTimestamp;
      }
    | Record<string, never> =>
    JSON.parse(sessionStorage.getItem(buildSessionStorageKey(graphName)) ?? '{}');

const setChartPeriodSessionParams = (
    graphName: GraphName,
    chartPeriodSessionParams:
        | {
              period: ChartPeriodType;
              date?: UTCTimestamp;
              from?: UTCTimestamp;
              to?: UTCTimestamp;
          }
        | Record<string, never>,
): void =>
    sessionStorage.setItem(
        buildSessionStorageKey(graphName),
        JSON.stringify(chartPeriodSessionParams),
    );

export const transferPeriodSessionParams = (source: GraphName, target: GraphName) => {
    setChartPeriodSessionParams(target, getChartPeriodSessionParams(source));
};

export const useChartPeriod = (graphName: GraphName, initialPeriod?: string): ChartPeriodProps => {
    const chartPeriodSessionParams = getChartPeriodSessionParams(graphName);

    const [period, setPeriod] = useState<ChartPeriodType>(chartPeriodSessionParams.period ?? 'day');
    const [date, setDate] = useState<UTCTimestamp | undefined>(
        chartPeriodSessionParams.from
            ? undefined
            : chartPeriodSessionParams.date ?? startOfTodayUTC,
    );
    const [from, setFrom] = useState<UTCTimestamp | undefined>(chartPeriodSessionParams.from);
    const [to, setTo] = useState<UTCTimestamp | undefined>(chartPeriodSessionParams.to);

    useEffect(() => {
        if (initialPeriod !== undefined) {
            setPeriod(initialPeriod as ChartPeriodType);
        }
    }, [initialPeriod]);

    useEffect(() => {
        setChartPeriodSessionParams(graphName, {
            period,
            date,
            from,
            to,
        });
    }, [period, date, from, to]);

    return {
        period,
        setPeriod,
        date,
        setDate,
        from,
        setFrom,
        to,
        setTo,
    };
};

export type FilterRange = {
    from: S8DateTime;
    to: S8DateTime;
};

export const datesFromChartPeriod = (
    from: UTCTimestamp,
    to: UTCTimestamp,
    period: ChartPeriodType,
): UTCTimestamp[] => {
    switch (period) {
        case 'day':
            return Array(24)
                .fill(from)
                .map((_, i) => addHoursUTC(_, i));
        case 'realtime':
            return Array(31)
                .fill(from)
                .map((_, i) => addMinutesUTC(_, i));
        case '7d':
            return Array(7)
                .fill(from)
                .map((_, i) => addDaysUTC(_, i));
        case '30d':
            return Array(30)
                .fill(from)
                .map((_, i) => addDaysUTC(_, i));
        case 'month':
            return Array(getDaysInMonthFromTimestamp(from))
                .fill(from)
                .map((_, i) => addDaysUTC(_, i));
        case '6mo':
            return Array(6)
                .fill(from)
                .map((_, i) => addMonthsUTC(_, i));
        case '12mo':
            return Array(12)
                .fill(from)
                .map((_, i) => addMonthsUTC(_, i));
        case 'custom':
            return Array(differenceDaysUTC(to, from) + 1)
                .fill(from)
                .map((_, i) => addDaysUTC(_, i));
        default:
            return [];
    }
};

export const labelsFromChartPeriod = (
    from: UTCTimestamp,
    to: UTCTimestamp,
    period: ChartPeriodType,
): string[] => {
    const periodDates = datesFromChartPeriod(from, to, period);

    switch (period) {
        case 'day':
            return periodDates.map((_) => displayHourDetails(_));
        case 'realtime':
            return periodDates.map((_, index) => `-${30 - index} m`);
        case '6mo':
        case '12mo':
            return periodDates.map((_) => displayFullMonth(_));
        default:
            return periodDates.map((_) => displayDayDetails(_));
    }
};

export const timeSliceFromPeriodType = (type: ChartPeriodType): TimeSlice => {
    switch (type) {
        case 'day':
            return TimeSlice.HOUR;
        case 'realtime':
            return TimeSlice.MINUTE;
        case '6mo':
        case '12mo':
            return TimeSlice.MONTH;
        default:
            return TimeSlice.DAY;
    }
};

export const stringFormatFromPeriodType = (type: ChartPeriodType): string => {
    switch (type) {
        case 'day':
        case 'realtime':
            return 'yyyy-MM-dd HH:mm:ss';
        case '6mo':
        case '12mo':
            return 'yyyy-MM';
        default:
            return 'yyyy-MM-dd';
    }
};

export const chartPeriodToFilterRange = (chartPeriod: ChartPeriod): FilterRange => {
    const date = chartPeriod.date ?? UTCNow;

    const from = chartPeriod.from ?? UTCNow;
    const to = chartPeriod.to ?? from;

    switch (chartPeriod.period) {
        case 'day':
            return {
                from: startOfDayFromTimestamp(date),
                to: endOfDayFromTimestamp(date),
            };
        case 'realtime':
            return {
                from: '-1860s',
                to: '0s',
            };
        case '7d':
            return {
                from: subDaysUTC(startOfTodayUTC, 6),
                to: UTCNow,
            };
        case '30d':
            return {
                from: subDaysUTC(startOfTodayUTC, 29),
                to: UTCNow,
            };
        case 'month':
            return {
                from: startOfMonthFromTimestamp(date),
                to: endOfMonthFromTimestamp(date),
            };
        case '6mo':
            return {
                from: startOfMonthFromTimestamp(subMonthsUTC(UTCNow, 5)),
                to: UTCNow,
            };
        case '12mo':
            return {
                from: startOfMonthFromTimestamp(subMonthsUTC(UTCNow, 11)),
                to: UTCNow,
            };
        case 'custom':
            return {
                from,
                to,
            };
        default:
            return {
                from: UTCNow,
                to: UTCNow,
            };
    }
};

export const chartPeriodToFilterRangePrev = (chartPeriod: ChartPeriod): FilterRange => {
    const currFilterRange = chartPeriodToFilterRange(chartPeriod);

    const diff = differenceDaysUTC(
        currFilterRange.to as UTCTimestamp,
        currFilterRange.from as UTCTimestamp,
    );

    switch (chartPeriod.period) {
        case 'day':
            return {
                from: subDaysUTC(currFilterRange.from as UTCTimestamp, 1),
                to: subDaysUTC(currFilterRange.to as UTCTimestamp, 1),
            };
        case 'realtime':
            return {
                from: '-3720s',
                to: '-1860s',
            };
        case '7d':
            return {
                from: subDaysUTC(currFilterRange.from as UTCTimestamp, 7),
                to: subDaysUTC(currFilterRange.to as UTCTimestamp, 7),
            };
        case '30d':
            return {
                from: subDaysUTC(currFilterRange.from as UTCTimestamp, 30),
                to: subDaysUTC(currFilterRange.to as UTCTimestamp, 30),
            };
        case 'month':
            return {
                from: subMonthsUTC(currFilterRange.from as UTCTimestamp, 1),
                to: subMonthsUTC(currFilterRange.to as UTCTimestamp, 1),
            };
        case '6mo':
            return {
                from: subMonthsUTC(currFilterRange.from as UTCTimestamp, 6),
                to: subMonthsUTC(currFilterRange.to as UTCTimestamp, 6),
            };
        case '12mo':
            return {
                from: subMonthsUTC(currFilterRange.from as UTCTimestamp, 12),
                to: subMonthsUTC(currFilterRange.to as UTCTimestamp, 12),
            };
        case 'custom':
            return {
                from: subDaysUTC(currFilterRange.from as UTCTimestamp, diff),
                to: subDaysUTC(currFilterRange.to as UTCTimestamp, diff),
            };
        default:
            return {
                from: UTCNow,
                to: UTCNow,
            };
    }
};

export const chartDataFromAppGroupingCount = (
    dates: UTCTimestamp[],
    groupingCountsResult: AppGroupingCount[],
    period: ChartPeriodType,
): { user_count: number; event_count: number }[] => {
    const timePartitionDateFormat = stringFormatFromPeriodType(period);

    return dates.map((_) => {
        const matchingValues = groupingCountsResult.find((unique) => {
            return isSameMinuteTimestamp(
                stringToUTCTimestamp(unique.key, timePartitionDateFormat),
                _,
            );
        });
        return {
            user_count: matchingValues === undefined ? 0 : matchingValues.user_count,
            event_count: matchingValues === undefined ? 0 : matchingValues.event_count,
        };
    });
};

export const chartDataFromGroupingCount = (
    dates: UTCTimestamp[],
    groupingCountsResult: GroupingCount[],
    period: ChartPeriodType,
): number[] => {
    const timePartitionDateFormat = stringFormatFromPeriodType(period);

    return dates.map((_) => {
        const matchingValues = groupingCountsResult.find((unique) => {
            return isSameMinuteTimestamp(
                stringToUTCTimestamp(unique.key, timePartitionDateFormat),
                _,
            );
        });
        return matchingValues === undefined ? 0 : matchingValues.count;
    });
};
