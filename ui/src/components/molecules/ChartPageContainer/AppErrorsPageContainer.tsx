import { FC, ReactNode } from 'react';
import ChartPeriodSelector from '../ChartPeriodSelector';
import ChartFilterSelector from '../ChartFilterSelector';
import { AppErrorContentProps } from '../../../types/props/AppErrorContentProps';
import ChartPageContainer, { ChartPageContainerProps, extractFilters } from './ChartPageContainer';

export type AppErrorsPageContainerProps = AppErrorContentProps & {
    children: ReactNode;
    ticks: number;
};

const AppErrorsPageContainer: FC<AppErrorsPageContainerProps> = (
    props: AppErrorsPageContainerProps,
) => {
    const { children, ticks, ...appDashboardContentProps } = props;
    const { chartPeriodProps, appQueryOptions, setFilter } = appDashboardContentProps;

    const chartPageContainerProps: ChartPageContainerProps = {
        leftHeaderBlock: (
            <ChartFilterSelector
                filters={extractFilters(appQueryOptions.filter_options)}
                setFilter={setFilter}
            />
        ),
        rightHeaderBlock: <ChartPeriodSelector {...chartPeriodProps} ticks={ticks} type="app" />,
        secondaryBlock: null,
    };

    return <ChartPageContainer {...chartPageContainerProps}>{children}</ChartPageContainer>;
};

export default AppErrorsPageContainer;
