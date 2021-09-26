import { FC } from 'react';
import { IngestEndpointAnalyticsContentProps } from '../../../types/props/IngestEndpointAnalyticsContentProps';
import ChartPageContent, { ChartPageContentProps } from './ChartPageContent';
import { IngestAnalyticsSummary } from '../../../lazyComponents/IngestAnalyticsSummary';
import { IngestAnalyticsChart } from '../../../lazyComponents/IngestAnalyticsChart';

const IngestAnalyticsPageContent: FC<IngestEndpointAnalyticsContentProps> = (
    props: IngestEndpointAnalyticsContentProps,
) => {
    const chartPageContentProps: ChartPageContentProps = {
        summaryBlock: <IngestAnalyticsSummary {...props} />,
        chartBlock: <IngestAnalyticsChart {...props} />,
        listsBlock: [],
    };

    return <ChartPageContent {...chartPageContentProps} />;
};

export default IngestAnalyticsPageContent;
