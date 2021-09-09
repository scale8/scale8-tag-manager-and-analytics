import { FC, useEffect, useState } from 'react';
import { IngestEndpointAnalyticsContentProps } from '../../types/props/IngestEndpointAnalyticsContentProps';
import { Card, Container, Grid } from '@material-ui/core';
import {
    chartPeriodToFilterRange,
    chartPeriodToFilterRangePrev,
    timeSliceFromPeriodType,
    useChartPeriod,
} from '../../hooks/chart/useChartPeriod';
import { IngestQueryOptions, TimeSlice } from '../../gql/generated/globalTypes';
import Loader from '../../components/organisms/Loader';
import { makeStyles } from '@material-ui/core/styles';
import IngestAnalyticsPageContainer from '../../components/molecules/IngestAnalyticsPageContainer';
import { IngestAnalyticsSummary } from '../../lazyComponents/IngestAnalyticsSummary';
import { IngestAnalyticsChart } from '../../lazyComponents/IngestAnalyticsChart';
import { useAnalyticsTimer } from '../../hooks/timer/useAnalyticsTimer';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        padding: theme.spacing(0, 0, 4, 0),
    },
    card: {
        height: '100%',
        padding: theme.spacing(2),
        display: 'flex',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: '4px',
    },
}));

const IngestEndpointAnalyticsContent: FC<IngestEndpointAnalyticsContentProps> = (
    props: IngestEndpointAnalyticsContentProps,
) => {
    const classes = useStyles();

    return (
        <Container className={classes.cardGrid} maxWidth="xl">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card className={classes.card} elevation={0}>
                        <IngestAnalyticsSummary {...props} />
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card className={classes.card} style={{ minHeight: '432px' }} elevation={0}>
                        <IngestAnalyticsChart {...props} />
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

const IngestEndpointAnalyticsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';
    const periodParam = props.params.period;

    const chartPeriodProps = useChartPeriod(periodParam);

    const [ingestQueryOptions, setIngestQueryOptions] = useState<IngestQueryOptions | undefined>(
        undefined,
    );

    const [ingestSummaryQueryOptions, setIngestSummaryQueryOptions] = useState<
        IngestQueryOptions | undefined
    >(undefined);

    const [ingestSummaryQueryOptionsPrev, setIngestSummaryQueryOptionsPrev] = useState<
        IngestQueryOptions | undefined
    >(undefined);

    const { period, date, from, to } = chartPeriodProps;

    const { refreshAt, ticks } = useAnalyticsTimer(period);

    useEffect(() => {
        setIngestQueryOptions({
            time_slice: timeSliceFromPeriodType(period),
            filter_options: {
                ...chartPeriodToFilterRange({
                    period,
                    date,
                    from,
                    to,
                }),
            },
        });
        setIngestSummaryQueryOptions({
            time_slice: TimeSlice.YEAR,
            filter_options: {
                ...chartPeriodToFilterRange({
                    period,
                    date,
                    from,
                    to,
                }),
            },
        });
        setIngestSummaryQueryOptionsPrev({
            time_slice: TimeSlice.YEAR,
            filter_options: {
                ...chartPeriodToFilterRangePrev({
                    period,
                    date,
                    from,
                    to,
                }),
            },
        });
    }, [period, date, from, to]);

    if (
        ingestQueryOptions === undefined ||
        ingestSummaryQueryOptions === undefined ||
        ingestSummaryQueryOptionsPrev === undefined
    ) {
        return <Loader />;
    }

    return (
        <IngestAnalyticsPageContainer
            chartPeriodProps={chartPeriodProps}
            ingestQueryOptions={ingestQueryOptions}
            ingestSummaryQueryOptions={ingestSummaryQueryOptions}
            ingestSummaryQueryOptionsPrev={ingestSummaryQueryOptionsPrev}
            refreshAt={refreshAt}
            ticks={ticks}
            id={id}
        >
            <IngestEndpointAnalyticsContent
                chartPeriodProps={chartPeriodProps}
                ingestQueryOptions={ingestQueryOptions}
                ingestSummaryQueryOptions={ingestSummaryQueryOptions}
                ingestSummaryQueryOptionsPrev={ingestSummaryQueryOptionsPrev}
                refreshAt={refreshAt}
                id={id}
            />
        </IngestAnalyticsPageContainer>
    );
};

export default IngestEndpointAnalyticsPage;
