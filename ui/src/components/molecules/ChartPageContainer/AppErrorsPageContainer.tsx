import { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import ChartPeriodSelector from '../ChartPeriodSelector';
import ChartFilterSelector from '../ChartFilterSelector';
import { AppErrorContentProps } from '../../../types/props/AppErrorContentProps';
import ChartPageContainer, { ChartPageContainerProps, extractFilters } from './ChartPageContainer';
import ChartBaseFilterSelector from '../../../lazyComponents/ChartBaseFilterSelector';
import { useAnalyticsTimer } from '../../../hooks/timer/useAnalyticsTimer';
import { UTCTimestamp } from '../../../utils/DateTimeUtils';

export type AppErrorsPageContainerProps = AppErrorContentProps & {
    children: ReactNode;
    setRefreshAt: Dispatch<SetStateAction<UTCTimestamp | undefined>>;
};

const AppErrorsPageContainer: FC<AppErrorsPageContainerProps> = (
    props: AppErrorsPageContainerProps,
) => {
    const { children, setRefreshAt, ...appErrorContentProps } = props;
    const { chartPeriodProps, appQueryOptions, setFilter } = appErrorContentProps;
    const { period } = chartPeriodProps;
    const { refreshAt, ticks } = useAnalyticsTimer(period);
    setRefreshAt(refreshAt);

    const chartPageContainerProps: ChartPageContainerProps = {
        leftHeaderBlock: <ChartBaseFilterSelector {...appErrorContentProps} />,
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

export default AppErrorsPageContainer;
