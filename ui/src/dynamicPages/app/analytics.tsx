import { FC, useEffect, useState } from 'react';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { transferPeriodSessionParams, useChartPeriod } from '../../hooks/chart/useChartPeriod';
import { useAnalyticsTimer } from '../../hooks/timer/useAnalyticsTimer';
import Loader from '../../components/organisms/Loader';
import { useQueryOptions } from '../../hooks/chart/useQueryOptions';
import { toApp } from '../../utils/NavigationPaths';
import { useRouter } from 'next/router';
import AppAnalyticsPageTagCheck from '../../lazyComponents/AppAnalyticsPageTagCheck';
import { transferFilterSessionParamToErrors, useFilters } from '../../hooks/chart/useFilters';

const AppAnalyticsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const router = useRouter();

    const [periodParam, setPeriodParam] = useState<string | undefined>();

    const id = props.params.id ?? '';

    useEffect(() => {
        if (props.params.period) {
            setPeriodParam(props.params.period);
            router.replace(toApp({ id }, 'analytics'), undefined, { shallow: true }).then();
        }
    }, []);

    const chartPeriodProps = useChartPeriod('analytics', periodParam);

    const { filters, setFilters, setFilter } = useFilters('analytics', {
        event: 'page-view',
    });

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

    const { period } = chartPeriodProps;

    const { refreshNow, refreshAt, ticks } = useAnalyticsTimer(period);

    const {
        queryOptions,
        summaryQueryOptions,
        summaryQueryOptionsPrev,
        summaryQueryOptionsCurrent,
    } = useQueryOptions(chartPeriodProps, filters);

    useEffect(() => {
        if (filters.event === 'error') {
            transferFilterSessionParamToErrors();
            transferPeriodSessionParams('analytics', 'errors');
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
        <AppAnalyticsPageTagCheck
            chartPeriodProps={chartPeriodProps}
            setFilter={setFilter}
            setFilters={setFilters}
            setEventGroup={setEventGroup}
            referrerTLD={filters.referrer_tld ?? undefined}
            appQueryOptions={queryOptions}
            appSummaryQueryOptions={summaryQueryOptions}
            appSummaryQueryOptionsPrev={summaryQueryOptionsPrev}
            appSummaryQueryOptionsCurrent={summaryQueryOptionsCurrent}
            refreshAt={refreshAt}
            refreshNow={refreshNow}
            ticks={ticks}
            id={id}
        />
    );
};

export default AppAnalyticsPage;
