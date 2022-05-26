import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AppQueryFilters } from '../../types/props/AppAnalyticsContentProps';

export type ChartFiltersProps = {
    filters: AppQueryFilters;
    setFilters: Dispatch<SetStateAction<AppQueryFilters>>;
    setFilter: (key: string, value: string | boolean | undefined) => void;
};

type GraphName = 'analytics' | 'errors';

const buildSessionStorageKey = (graphName: GraphName) => `${graphName}-chart-filter-params`;

const getChartFilterSessionParams = (
    graphName: GraphName,
    defaultFilters: AppQueryFilters,
): AppQueryFilters => {
    const storedFilters = sessionStorage.getItem(buildSessionStorageKey(graphName));
    return storedFilters ? JSON.parse(storedFilters) : defaultFilters;
};

const setChartFilterSessionParams = (graphName: GraphName, filters: AppQueryFilters): void =>
    sessionStorage.setItem(buildSessionStorageKey(graphName), JSON.stringify(filters));

export const transferFilterSessionParamToErrors = () => {
    const errorsFilterSessionParams: AppQueryFilters = {
        ...getChartFilterSessionParams('analytics', {}),
        event_group: undefined,
        event: 'error',
    };
    setChartFilterSessionParams('errors', errorsFilterSessionParams);
};

export const useFilters = (
    graphName: 'analytics' | 'errors',
    initialFilter: AppQueryFilters,
): ChartFiltersProps => {
    const [filters, setFilters] = useState<AppQueryFilters>(
        getChartFilterSessionParams(graphName, initialFilter),
    );

    useEffect(() => {
        if (graphName !== 'analytics' || filters.event !== 'error') {
            setChartFilterSessionParams(graphName, filters);
        }
    }, [filters]);

    const setFilter = (key: string, value: string | boolean | undefined) => {
        // browser_version depends on browser, unset it if required
        if (key === 'browser' && value === undefined) {
            setFilters({
                ...filters,
                browser: undefined,
                browser_version: undefined,
            });
        } else {
            setFilters({
                ...filters,
                [key]: value,
            });
        }
    };

    return {
        filters,
        setFilters,
        setFilter,
    };
};
