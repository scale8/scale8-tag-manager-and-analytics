import makeStyles from '@mui/styles/makeStyles';
import {
    displayDayMonth,
    displayDayMonthTime,
    getHoursUTC,
    getMinutesUTC,
    setMinutesUTC,
    startOfMinuteUTC,
    subHoursUTC,
    subMinutesUTC,
    UTCNow,
    UTCTimestamp,
} from './DateTimeUtils';

export type UsageDetails = {
    minute: UTCTimestamp;
    field1: number;
    field2: number;
};

export const useStyles = makeStyles(() => ({
    zoomSelect: {
        fontWeight: 'bold',
        marginLeft: '20px',
        cursor: 'pointer',
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&$selected': {
            color: '#1890ff',
            cursor: 'default',
        },
        '&:focus': {
            color: '#40a9ff',
        },
    },
    dropdown: {
        marginTop: '-4px',
        '& .MuiSelect-select:focus': {
            backgroundColor: 'transparent',
        },
    },
    divider: {
        height: '20px',
        marginTop: '2px',
        marginLeft: '13px',
    },
    selected: {},
}));

const zoomToMinutes = (zoom: string): number => {
    switch (zoom) {
        case '1h':
            return 60;
        case '2h':
            return 120;
        case '12h':
            return 720;
        case '1d':
            return 1440;
        case '3d':
            return 4320;
        case '1w':
            return 10080;
        case '2w':
            return 20160;
        default:
            return 0;
    }
};

export const zoomDefaultAggregateMinutes = (zoom: string): number => {
    switch (zoom) {
        case '1h':
            return 1;
        case '2h':
            return 5;
        case '12h':
            return 15;
        case '1d':
            return 15;
        case '3d':
            return 60;
        case '1w':
            return 360;
        case '2w':
            return 720;
        default:
            return 0;
    }
};

export const zoomMinAggregateMinutes = (zoom: string): number => {
    switch (zoom) {
        case '1h':
            return 1;
        case '2h':
            return 1;
        case '12h':
            return 5;
        case '1d':
            return 15;
        case '3d':
            return 60;
        case '1w':
            return 60;
        case '2w':
            return 360;
        default:
            return 0;
    }
};

export const zoomMaxAggregateMinutes = (zoom: string): number => {
    switch (zoom) {
        case '1h':
            return 15;
        case '2h':
            return 15;
        case '12h':
            return 60;
        case '1d':
            return 360;
        case '3d':
            return 720;
        case '1w':
            return 1440;
        case '2w':
            return 1440;
        default:
            return 0;
    }
};

const roundByRatio = (date: UTCTimestamp, ratio: number) => {
    if (ratio < 60) {
        return subMinutesUTC(date, getMinutesUTC(date) % ratio);
    } else if (ratio < 1440) {
        // Hours
        const dateOnTheHour = setMinutesUTC(date, 0);
        const hourRatio = ratio / 60;
        return subHoursUTC(dateOnTheHour, getHoursUTC(date) % hourRatio);
    } else {
        // Days
        return subHoursUTC(setMinutesUTC(date, 0), 0);
    }
};

const formatByRatio = (timestamp: UTCTimestamp, ratio: number): string => {
    if (ratio < 60) {
        return displayDayMonthTime(timestamp);
    } else if (ratio < 1440) {
        // Hours
        return displayDayMonthTime(timestamp);
    } else {
        // Days
        return displayDayMonth(timestamp);
    }
};

export const prepareUsageRange = (
    usage: UsageDetails[],
    zoom: string,
    aggregateMinutes: number,
): UsageDetails[] => {
    const aggregateRatio = aggregateMinutes;
    const initialDate = roundByRatio(startOfMinuteUTC(UTCNow), aggregateRatio);

    const aggregateDateEntries = [];
    for (let i = 0; i <= zoomToMinutes(zoom) / aggregateMinutes; i++) {
        aggregateDateEntries.push(subMinutesUTC(initialDate, i * aggregateRatio));
    }

    const baseRange: Map<UTCTimestamp, UsageDetails> = new Map<UTCTimestamp, UsageDetails>(
        aggregateDateEntries.map((_) => [
            _,
            {
                minute: _,
                field1: 0,
                field2: 0,
            },
        ]),
    );

    const range: Map<UTCTimestamp, UsageDetails> = usage.reduce((accumulator, currentValue) => {
        const currentValueDate = roundByRatio(
            startOfMinuteUTC(currentValue.minute),
            aggregateRatio,
        );
        const currentAccumulatorValueOnDate = accumulator.get(currentValueDate);

        if (currentAccumulatorValueOnDate !== undefined) {
            accumulator.set(currentValueDate, {
                minute: currentAccumulatorValueOnDate.minute,
                field1: currentAccumulatorValueOnDate.field1 + currentValue.field1,
                field2: currentAccumulatorValueOnDate.field2 + currentValue.field2,
            });
        }

        return accumulator;
    }, baseRange);

    return Array.from(range.values()).reverse();
};

export const labelsFromRange = (usageRange: UsageDetails[], aggregateMinutes: number): string[] => {
    return usageRange.map((_) => formatByRatio(_.minute, aggregateMinutes));
};
