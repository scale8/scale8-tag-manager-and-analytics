import { FC, ReactNode } from 'react';
import ChartPeriodSelector from '../ChartPeriodSelector';
import { IngestEndpointAnalyticsContentProps } from '../../../types/props/IngestEndpointAnalyticsContentProps';
import ChartPageContainer, { ChartPageContainerProps } from './ChartPageContainer';

export type IngestAnalyticsPageContainerProps = IngestEndpointAnalyticsContentProps & {
    children: ReactNode;
    ticks: number;
};

const IngestAnalyticsPageContainer: FC<IngestAnalyticsPageContainerProps> = (
    props: IngestAnalyticsPageContainerProps,
) => {
    const { children, ticks, ...appDashboardContentProps } = props;
    const { chartPeriodProps } = appDashboardContentProps;

    const chartPageContainerProps: ChartPageContainerProps = {
        leftHeaderBlock: null,
        rightHeaderBlock: (
            <ChartPeriodSelector
                {...chartPeriodProps}
                refreshNow={appDashboardContentProps.refreshNow}
                ticks={ticks}
                type="endpoint"
            />
        ),
        secondaryBlock: null,
    };

    return <ChartPageContainer {...chartPageContainerProps}>{children}</ChartPageContainer>;
};

export default IngestAnalyticsPageContainer;
