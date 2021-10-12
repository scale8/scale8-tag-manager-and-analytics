import { FC, useState } from 'react';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { AppQueryFilters } from '../../types/props/AppAnalyticsContentProps';
import { useChartPeriod } from '../../hooks/chart/useChartPeriod';
import { useAnalyticsTimer } from '../../hooks/timer/useAnalyticsTimer';
import Loader from '../../components/organisms/Loader';
import AppErrorsPageContainer from '../../components/molecules/ChartPageContainer/AppErrorsPageContainer';
import AppErrorsPageContent from '../../components/molecules/ChartPageContent/AppErrorsPageContent';
import { useQueryOptions } from '../../hooks/useQueryOptions';

const AppErrorsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';
    const periodParam = props.params.period;

    const chartPeriodProps = useChartPeriod(periodParam);

    const [filters, setFilters] = useState<AppQueryFilters>({
        event: 'error',
    });

    const setFilter = (key: string, value: string | boolean | undefined) => {
        setFilters({
            ...filters,
            [key]: value,
        });
    };

    const { period } = chartPeriodProps;

    const { refreshAt, ticks } = useAnalyticsTimer(period);

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
            filters={filters}
            setFilters={setFilters}
            appQueryOptions={queryOptions}
            appSummaryQueryOptions={summaryQueryOptions}
            appSummaryQueryOptionsPrev={summaryQueryOptionsPrev}
            appSummaryQueryOptionsCurrent={summaryQueryOptionsCurrent}
            refreshAt={refreshAt}
            ticks={ticks}
            id={id}
        >
            <AppErrorsPageContent
                chartPeriodProps={chartPeriodProps}
                setFilter={setFilter}
                filters={filters}
                setFilters={setFilters}
                appQueryOptions={queryOptions}
                appSummaryQueryOptions={summaryQueryOptions}
                appSummaryQueryOptionsPrev={summaryQueryOptionsPrev}
                appSummaryQueryOptionsCurrent={summaryQueryOptionsCurrent}
                refreshAt={refreshAt}
                id={id}
            />
        </AppErrorsPageContainer>
    );
};

export default AppErrorsPage;
