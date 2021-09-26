import { FC } from 'react';
import { useChartPeriod } from '../../hooks/chart/useChartPeriod';
import Loader from '../../components/organisms/Loader';
import IngestAnalyticsPageContainer from '../../components/molecules/ChartPageContainer/IngestAnalyticsPageContainer';
import { useAnalyticsTimer } from '../../hooks/timer/useAnalyticsTimer';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { useQueryOptions } from '../../hooks/useQueryOptions';
import IngestAnalyticsPageContent from '../../components/molecules/ChartPageContent/IngestAnalyticsPageContent';

const IngestEndpointAnalyticsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';
    const periodParam = props.params.period;

    const chartPeriodProps = useChartPeriod(periodParam);

    const { period } = chartPeriodProps;

    const { refreshAt, ticks } = useAnalyticsTimer(period);

    const { queryOptions, summaryQueryOptions, summaryQueryOptionsPrev } =
        useQueryOptions(chartPeriodProps);

    if (
        queryOptions === undefined ||
        summaryQueryOptions === undefined ||
        summaryQueryOptionsPrev === undefined
    ) {
        return <Loader />;
    }

    return (
        <IngestAnalyticsPageContainer
            chartPeriodProps={chartPeriodProps}
            ingestQueryOptions={queryOptions}
            ingestSummaryQueryOptions={summaryQueryOptions}
            ingestSummaryQueryOptionsPrev={summaryQueryOptionsPrev}
            refreshAt={refreshAt}
            ticks={ticks}
            id={id}
        >
            <IngestAnalyticsPageContent
                chartPeriodProps={chartPeriodProps}
                ingestQueryOptions={queryOptions}
                ingestSummaryQueryOptions={summaryQueryOptions}
                ingestSummaryQueryOptionsPrev={summaryQueryOptionsPrev}
                refreshAt={refreshAt}
                id={id}
            />
        </IngestAnalyticsPageContainer>
    );
};

export default IngestEndpointAnalyticsPage;
