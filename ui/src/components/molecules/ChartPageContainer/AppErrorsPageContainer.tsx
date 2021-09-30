import { FC, ReactNode } from 'react';
import ChartPeriodSelector from '../ChartPeriodSelector';
import ChartFilterSelector from '../ChartFilterSelector';
import { AppErrorContentProps } from '../../../types/props/AppErrorContentProps';
import ChartPageContainer, { ChartPageContainerProps, extractFilters } from './ChartPageContainer';
import ChartBaseFilterSelector from '../../../lazyComponents/ChartBaseFilterSelector';

export type AppErrorsPageContainerProps = AppErrorContentProps & {
    children: ReactNode;
    ticks: number;
};

const AppErrorsPageContainer: FC<AppErrorsPageContainerProps> = (
    props: AppErrorsPageContainerProps,
) => {
    const { children, ticks, ...appErrorContentProps } = props;
    const { chartPeriodProps, appQueryOptions, setFilter } = appErrorContentProps;

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
