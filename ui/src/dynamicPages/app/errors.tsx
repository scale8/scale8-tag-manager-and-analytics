import { FC } from 'react';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { useChartPeriod } from '../../hooks/chart/useChartPeriod';
import { useAnalyticsTimer } from '../../hooks/timer/useAnalyticsTimer';
import Loader from '../../components/organisms/Loader';
import AppErrorsPageContainer from '../../components/molecules/ChartPageContainer/AppErrorsPageContainer';
import AppErrorsPageContent from '../../components/molecules/ChartPageContent/AppErrorsPageContent';
import { useQueryOptions } from '../../hooks/chart/useQueryOptions';
import { useFilters } from '../../hooks/chart/useFilters';

const AppErrorsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';
    const periodParam = props.params.period;

    const chartPeriodProps = useChartPeriod('errors', periodParam);

    const { filters, setFilter, setFilters } = useFilters('errors', {
        event: 'error',
    });

    const { period } = chartPeriodProps;

    const { refreshNow, refreshAt, ticks } = useAnalyticsTimer(period);

    const {
        queryOptions,
        summaryQueryOptions,
        summaryQueryOptionsPrev,
        summaryQueryOptionsCurrent,
    } = useQueryOptions(chartPeriodProps, filters);

    if (
        queryOptions === undefined ||
        summaryQueryOptions === undefined ||
        summaryQueryOptionsPrev === undefined ||
        summaryQueryOptionsCurrent === undefined
    ) {
        return <Loader />;
    }

    return (
        <AppErrorsPageContainer
            chartPeriodProps={chartPeriodProps}
            setFilter={setFilter}
            setFilters={setFilters}
            appQueryOptions={queryOptions}
            appSummaryQueryOptions={summaryQueryOptions}
            appSummaryQueryOptionsPrev={summaryQueryOptionsPrev}
            appSummaryQueryOptionsCurrent={summaryQueryOptionsCurrent}
            refreshNow={refreshNow}
            refreshAt={refreshAt}
            ticks={ticks}
            id={id}
        >
            <AppErrorsPageContent
                chartPeriodProps={chartPeriodProps}
                setFilter={setFilter}
                setFilters={setFilters}
                appQueryOptions={queryOptions}
                appSummaryQueryOptions={summaryQueryOptions}
                appSummaryQueryOptionsPrev={summaryQueryOptionsPrev}
                appSummaryQueryOptionsCurrent={summaryQueryOptionsCurrent}
                refreshNow={refreshNow}
                refreshAt={refreshAt}
                id={id}
            />
        </AppErrorsPageContainer>
    );
};

export default AppErrorsPage;
