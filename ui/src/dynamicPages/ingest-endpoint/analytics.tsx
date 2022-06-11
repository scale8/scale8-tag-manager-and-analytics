import { FC, useEffect, useState } from 'react';
import { useChartPeriod } from '../../hooks/chart/useChartPeriod';
import Loader from '../../components/organisms/Loader';
import IngestAnalyticsPageContainer from '../../components/molecules/ChartPageContainer/IngestAnalyticsPageContainer';
import { useAnalyticsTimer } from '../../hooks/timer/useAnalyticsTimer';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { useQueryOptions } from '../../hooks/chart/useQueryOptions';
import IngestAnalyticsPageContent from '../../components/molecules/ChartPageContent/IngestAnalyticsPageContent';
import { toIngestEndpoint } from '../../utils/NavigationPaths';
import { useRouter } from 'next/router';

const IngestEndpointAnalyticsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';
    const router = useRouter();

    const [periodParam, setPeriodParam] = useState<string | undefined>();

    useEffect(() => {
        if (props.params.period) {
            setPeriodParam(props.params.period);
            router
                .replace(toIngestEndpoint({ id }, 'analytics'), undefined, { shallow: true })
                .then();
        }
    }, []);

    const chartPeriodProps = useChartPeriod('endpoint', periodParam);

    const { period } = chartPeriodProps;

    const { refreshNow, refreshAt, ticks } = useAnalyticsTimer(period);

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
            refreshNow={refreshNow}
            refreshAt={refreshAt}
            ticks={ticks}
            id={id}
        >
            <IngestAnalyticsPageContent
                chartPeriodProps={chartPeriodProps}
                ingestQueryOptions={queryOptions}
                ingestSummaryQueryOptions={summaryQueryOptions}
                ingestSummaryQueryOptionsPrev={summaryQueryOptionsPrev}
                refreshNow={refreshNow}
                refreshAt={refreshAt}
                id={id}
            />
        </IngestAnalyticsPageContainer>
    );
};

export default IngestEndpointAnalyticsPage;
