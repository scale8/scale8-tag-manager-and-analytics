import { useEffect, useRef, useState } from 'react';
import { UTCCurrent, UTCTimestamp } from '../../utils/DateTimeUtils';
import { ChartPeriodType } from '../chart/useChartPeriod';

export type analyticsTimerValues = {
    refreshNow: () => void;
    refreshAt: UTCTimestamp | undefined;
    ticks: number;
};

export const useAnalyticsTimer = (period: ChartPeriodType): analyticsTimerValues => {
    const [refreshAt, setRefreshAt] = useState<UTCTimestamp | undefined>(undefined);

    const [ticks, setTicks] = useState(100);
    const timer = useRef<NodeJS.Timeout | null>(null);

    const refreshNow = () => {
        setRefreshAt(UTCCurrent());
        setTicks(100);
    };

    useEffect(() => {
        if (period === 'realtime') {
            // reset ticks
            setTicks(100);
            timer.current = setInterval(() => {
                setTicks((v) => v - 1);
            }, 300);
        } else {
            if (timer.current !== null) {
                clearInterval(timer.current);
            }
        }
        return () => {
            if (timer.current !== null) {
                clearInterval(timer.current);
            }
        };
    }, [period]);

    if (ticks === 0) {
        if (timer.current !== null) {
            refreshNow();
        }
    }

    return {
        refreshNow,
        refreshAt,
        ticks,
    };
};
