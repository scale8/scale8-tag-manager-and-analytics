import { FC, useEffect, useState } from 'react';
import { Card, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import {
    AppAnalyticsContentProps,
    AppQueryFilters,
} from '../../types/props/AppAnalyticsContentProps';
import { AppAnalyticsSummaryRealtime } from '../../lazyComponents/AppAnalyticsSummaryRealtime';
import { AppAnalyticsSummary } from '../../lazyComponents/AppAnalyticsSummary';
import { AppAnalyticsChart } from '../../lazyComponents/AppAnalyticsChart';
import { AppAnalyticsSources } from '../../lazyComponents/lists/AppAnalyticsSources';
import { AppAnalyticsPages } from '../../lazyComponents/lists/AppAnalyticsPages';
import { AppAnalyticsCountries } from '../../lazyComponents/lists/AppAnalyticsCountries';
import { AppAnalyticsDevices } from '../../lazyComponents/lists/AppAnalyticsDevices';
import {
    chartPeriodToFilterRange,
    chartPeriodToFilterRangePrev,
    timeSliceFromPeriodType,
    useChartPeriod,
} from '../../hooks/chart/useChartPeriod';
import { AppQueryOptions, TimeSlice } from '../../gql/generated/globalTypes';
import { useAnalyticsTimer } from '../../hooks/timer/useAnalyticsTimer';
import AppAnalyticsPageContainer from '../../components/molecules/AppAnalyticsPageContainer';
import Loader from '../../components/organisms/Loader';

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

const AppAnalyticsContent: FC<AppAnalyticsContentProps> = (props: AppAnalyticsContentProps) => {
    const classes = useStyles();

    const { chartPeriodProps } = props;

    return (
        <Container className={classes.cardGrid} maxWidth="xl">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card className={classes.card} elevation={0}>
                        {chartPeriodProps.period === 'realtime' ? (
                            <AppAnalyticsSummaryRealtime {...props} />
                        ) : (
                            <AppAnalyticsSummary {...props} />
                        )}
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card className={classes.card} style={{ minHeight: '432px' }} elevation={0}>
                        <AppAnalyticsChart {...props} />
                    </Card>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                    <AppAnalyticsSources {...props} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                    <AppAnalyticsPages {...props} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                    <AppAnalyticsCountries {...props} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                    <AppAnalyticsDevices {...props} />
                </Grid>
            </Grid>
        </Container>
    );
};

const AppAnalyticsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';
    const periodParam = props.params.period;

    const chartPeriodProps = useChartPeriod(periodParam);

    const [appQueryOptions, setAppQueryOptions] = useState<AppQueryOptions | undefined>(undefined);

    const [appSummaryQueryOptions, setAppSummaryQueryOptions] = useState<
        AppQueryOptions | undefined
    >(undefined);

    const [appSummaryQueryOptionsPrev, setAppSummaryQueryOptionsPrev] = useState<
        AppQueryOptions | undefined
    >(undefined);

    const [appSummaryQueryOptionsCurrent, setAppSummaryQueryOptionsCurrent] = useState<
        AppQueryOptions | undefined
    >(undefined);

    const [filters, setFilters] = useState<AppQueryFilters>({
        event: 'page-view',
    });

    const setFilter = (key: string, value: string | boolean | undefined) => {
        setFilters({
            ...filters,
            [key]: value,
        });
    };

    const setEventGroup = (value: string | undefined) => {
        if (value === undefined) {
            if (filters.hasOwnProperty('event') && filters.event !== undefined) {
                setFilters({
                    ...filters,
                    event_group: undefined,
                });
            } else {
                setFilters({
                    ...filters,
                    event: 'page-view',
                    event_group: undefined,
                });
            }
        } else {
            setFilters({
                ...filters,
                event: undefined,
                event_group: value,
            });
        }
    };

    const { period, date, from, to } = chartPeriodProps;

    const { refreshAt, ticks } = useAnalyticsTimer(period);

    useEffect(() => {
        setAppQueryOptions({
            time_slice: timeSliceFromPeriodType(period),
            filter_options: {
                ...chartPeriodToFilterRange({
                    period,
                    date,
                    from,
                    to,
                }),
                ...filters,
            },
        });
        setAppSummaryQueryOptions({
            time_slice: TimeSlice.YEAR,
            filter_options: {
                ...chartPeriodToFilterRange({
                    period,
                    date,
                    from,
                    to,
                }),
                ...filters,
            },
        });
        setAppSummaryQueryOptionsPrev({
            time_slice: TimeSlice.YEAR,
            filter_options: {
                ...chartPeriodToFilterRangePrev({
                    period,
                    date,
                    from,
                    to,
                }),
                ...filters,
            },
        });
        setAppSummaryQueryOptionsCurrent({
            time_slice: TimeSlice.YEAR,
            filter_options: {
                from: '-300s',
                to: '0s',
            },
        });
    }, [period, date, from, to, filters]);

    if (
        appQueryOptions === undefined ||
        appSummaryQueryOptions === undefined ||
        appSummaryQueryOptionsPrev === undefined ||
        appSummaryQueryOptionsCurrent === undefined
    ) {
        return <Loader />;
    }

    return (
        <AppAnalyticsPageContainer
            chartPeriodProps={chartPeriodProps}
            setFilter={setFilter}
            setEventGroup={setEventGroup}
            referrerTLD={filters.referrer_tld ?? undefined}
            appQueryOptions={appQueryOptions}
            appSummaryQueryOptions={appSummaryQueryOptions}
            appSummaryQueryOptionsPrev={appSummaryQueryOptionsPrev}
            appSummaryQueryOptionsCurrent={appSummaryQueryOptionsCurrent}
            refreshAt={refreshAt}
            ticks={ticks}
            id={id}
        >
            <AppAnalyticsContent
                chartPeriodProps={chartPeriodProps}
                setFilter={setFilter}
                setEventGroup={setEventGroup}
                referrerTLD={filters.referrer_tld ?? undefined}
                appQueryOptions={appQueryOptions}
                appSummaryQueryOptions={appSummaryQueryOptions}
                appSummaryQueryOptionsPrev={appSummaryQueryOptionsPrev}
                appSummaryQueryOptionsCurrent={appSummaryQueryOptionsCurrent}
                refreshAt={refreshAt}
                id={id}
            />
        </AppAnalyticsPageContainer>
    );
};

export default AppAnalyticsPage;
