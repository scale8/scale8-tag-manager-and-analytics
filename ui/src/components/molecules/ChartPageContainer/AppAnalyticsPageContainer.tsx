import { FC, ReactNode } from 'react';
import ChartPeriodSelector from '../ChartPeriodSelector';
import ChartFilterSelector from '../ChartFilterSelector';
import ChartEventSelector from '../../../lazyComponents/ChartEventSelector';
import { AppAnalyticsContentProps } from '../../../types/props/AppAnalyticsContentProps';
import ChartPageContainer, { ChartPageContainerProps, extractFilters } from './ChartPageContainer';
import ChartBaseFilterSelector from '../../../lazyComponents/ChartBaseFilterSelector';

export type AppAnalyticsPageContainerProps = AppAnalyticsContentProps & {
    children: ReactNode;
};

const AppAnalyticsPageContainer: FC<AppAnalyticsPageContainerProps> = (
    props: AppAnalyticsPageContainerProps,
) => {
    const { children, ...appDashboardContentProps } = props;
    const { chartPeriodProps, appQueryOptions, setFilter } = appDashboardContentProps;

    const chartPageContainerProps: ChartPageContainerProps = {
        leftHeaderBlock: (
            <>
                <ChartBaseFilterSelector {...appDashboardContentProps} />
                <ChartEventSelector {...appDashboardContentProps} />
            </>
        ),
        rightHeaderBlock: (
            <ChartPeriodSelector
                {...chartPeriodProps}
                ticks={appDashboardContentProps.ticks}
                type="app"
            />
        ),
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
