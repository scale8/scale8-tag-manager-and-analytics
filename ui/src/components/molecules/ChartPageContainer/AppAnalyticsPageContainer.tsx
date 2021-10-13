import { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import ChartPeriodSelector from '../ChartPeriodSelector';
import ChartFilterSelector from '../ChartFilterSelector';
import ChartEventSelector from '../../../lazyComponents/ChartEventSelector';
import { AppAnalyticsContentProps } from '../../../types/props/AppAnalyticsContentProps';
import ChartPageContainer, { ChartPageContainerProps, extractFilters } from './ChartPageContainer';
import ChartBaseFilterSelector from '../../../lazyComponents/ChartBaseFilterSelector';
import { useAnalyticsTimer } from '../../../hooks/timer/useAnalyticsTimer';
import { UTCTimestamp } from '../../../utils/DateTimeUtils';

export type AppAnalyticsPageContainerProps = AppAnalyticsContentProps & {
    children: ReactNode;
    setRefreshAt: Dispatch<SetStateAction<UTCTimestamp | undefined>>;
};

const AppAnalyticsPageContainer: FC<AppAnalyticsPageContainerProps> = (
    props: AppAnalyticsPageContainerProps,
) => {
    const { children, setRefreshAt, ...appDashboardContentProps } = props;
    const { chartPeriodProps, appQueryOptions, setFilter } = appDashboardContentProps;
    const { period } = chartPeriodProps;
    const { refreshAt, ticks } = useAnalyticsTimer(period);
    setRefreshAt(refreshAt);

    const chartPageContainerProps: ChartPageContainerProps = {
        leftHeaderBlock: (
            <>
                <ChartBaseFilterSelector {...appDashboardContentProps} />
                <ChartEventSelector {...appDashboardContentProps} />
            </>
        ),
        rightHeaderBlock: <ChartPeriodSelector {...chartPeriodProps} ticks={ticks} type="app" />,
        secondaryBlock: (
            <ChartFilterSelector
                filters={extractFilters(appQueryOptions.filter_options)}
                setFilter={setFilter}
            />
        ),
    };

    return <ChartPageContainer {...chartPageContainerProps}>{children}</ChartPageContainer>;
};

export default AppAnalyticsPageContainer;
