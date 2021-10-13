import { FC, useEffect, useState } from 'react';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { AppQueryFilters } from '../../types/props/AppAnalyticsContentProps';
import { useChartPeriod } from '../../hooks/chart/useChartPeriod';
import AppAnalyticsPageContainer from '../../components/molecules/ChartPageContainer/AppAnalyticsPageContainer';
import Loader from '../../components/organisms/Loader';
import AppAnalyticsPageContent from '../../components/molecules/ChartPageContent/AppAnalyticsPageContent';
import { useQueryOptions } from '../../hooks/useQueryOptions';
import { toApp } from '../../utils/NavigationPaths';
import { useRouter } from 'next/router';
import { UTCTimestamp } from '../../utils/DateTimeUtils';

const AppAnalyticsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';
    const router = useRouter();
    const periodParam = props.params.period;

    const [refreshAt, setRefreshAt] = useState<UTCTimestamp | undefined>(undefined);

    const chartPeriodProps = useChartPeriod(periodParam);

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

    const {
        queryOptions,
        summaryQueryOptions,
        summaryQueryOptionsPrev,
        summaryQueryOptionsCurrent,
    } = useQueryOptions(chartPeriodProps, filters);

    useEffect(() => {
        if (filters.event === 'error') {
            router.push(toApp({ id }, 'errors')).then();
        }
    }, [filters]);

    if (
        filters.event === 'error' ||
        queryOptions === undefined ||
        summaryQueryOptions === undefined ||
        summaryQueryOptionsPrev === undefined ||
        summaryQueryOptionsCurrent === undefined
    ) {
        return <Loader />;
    }

    return (
        <AppAnalyticsPageContainer
            chartPeriodProps={chartPeriodProps}
            setFilter={setFilter}
            filters={filters}
            setFilters={setFilters}
            setEventGroup={setEventGroup}
            referrerTLD={filters.referrer_tld ?? undefined}
            appQueryOptions={queryOptions}
            appSummaryQueryOptions={summaryQueryOptions}
            appSummaryQueryOptionsPrev={summaryQueryOptionsPrev}
            appSummaryQueryOptionsCurrent={summaryQueryOptionsCurrent}
            refreshAt={refreshAt}
            setRefreshAt={setRefreshAt}
            id={id}
        >
            <AppAnalyticsPageContent
                chartPeriodProps={chartPeriodProps}
                setFilter={setFilter}
                filters={filters}
                setFilters={setFilters}
                setEventGroup={setEventGroup}
                referrerTLD={filters.referrer_tld ?? undefined}
                appQueryOptions={queryOptions}
                appSummaryQueryOptions={summaryQueryOptions}
                appSummaryQueryOptionsPrev={summaryQueryOptionsPrev}
                appSummaryQueryOptionsCurrent={summaryQueryOptionsCurrent}
                refreshAt={refreshAt}
                id={id}
            />
        </AppAnalyticsPageContainer>
    );
};

export default AppAnalyticsPage;
