import { FC } from 'react';
import { AppAnalyticsContentProps } from '../../../types/props/AppAnalyticsContentProps';
import { AppAnalyticsSummaryRealtime } from '../../../lazyComponents/AppAnalyticsSummaryRealtime';
import { AppAnalyticsSummary } from '../../../lazyComponents/AppAnalyticsSummary';
import { AppAnalyticsChart } from '../../../lazyComponents/AppAnalyticsChart';
import { AppAnalyticsSources } from '../../../lazyComponents/lists/AppAnalyticsSources';
import { AppAnalyticsPages } from '../../../lazyComponents/lists/AppAnalyticsPages';
import { AppAnalyticsCountries } from '../../../lazyComponents/lists/AppAnalyticsCountries';
import ChartPageContent, { ChartPageContentProps } from './ChartPageContent';
import { AppDevicesLists } from '../../../lazyComponents/lists/AppDevicesLists';

const AppAnalyticsPageContent: FC<AppAnalyticsContentProps> = (props: AppAnalyticsContentProps) => {
    const { chartPeriodProps } = props;

    const chartPageContentProps: ChartPageContentProps = {
        summaryBlock:
            chartPeriodProps.period === 'realtime' ? (
                <AppAnalyticsSummaryRealtime {...props} />
            ) : (
                <AppAnalyticsSummary {...props} />
            ),
        chartBlock: <AppAnalyticsChart {...props} />,
        listsBlock: [
            <AppAnalyticsSources {...props} />,
            <AppAnalyticsPages {...props} />,
            <AppAnalyticsCountries {...props} />,
            <AppDevicesLists {...props} forErrors={false} />,
        ],
    };

    return <ChartPageContent {...chartPageContentProps} />;
};

export default AppAnalyticsPageContent;
