import { FC, ReactNode } from 'react';
import ChartPeriodSelector from '../ChartPeriodSelector';
import ChartFilterSelector from '../ChartFilterSelector';
import ChartEventSelector from '../../../lazyComponents/ChartEventSelector';
import { AppAnalyticsContentProps } from '../../../types/props/AppAnalyticsContentProps';
import ChartPageContainer, { ChartPageContainerProps, extractFilters } from './ChartPageContainer';

export type AppAnalyticsPageContainerProps = AppAnalyticsContentProps & {
    children: ReactNode;
    ticks: number;
};

const AppAnalyticsPageContainer: FC<AppAnalyticsPageContainerProps> = (
    props: AppAnalyticsPageContainerProps,
) => {
    const { children, ticks, ...appDashboardContentProps } = props;
    const { chartPeriodProps, appQueryOptions, setFilter } = appDashboardContentProps;

    const chartPageContainerProps: ChartPageContainerProps = {
        leftHeaderBlock: <ChartEventSelector {...appDashboardContentProps} />,
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
