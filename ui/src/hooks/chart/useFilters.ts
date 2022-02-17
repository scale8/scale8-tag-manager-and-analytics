import { Dispatch, SetStateAction, useState } from 'react';
import { AppQueryFilters } from '../../types/props/AppAnalyticsContentProps';

export type ChartFiltersProps = {
    filters: AppQueryFilters;
    setFilters: Dispatch<SetStateAction<AppQueryFilters>>;
    setFilter: (key: string, value: string | boolean | undefined) => void;
};

export const useFilters = (
    graphName: 'analytics' | 'errors',
    initialFilter: AppQueryFilters,
): ChartFiltersProps => {
    const [filters, setFilters] = useState<AppQueryFilters>(initialFilter);

    const setFilter = (key: string, value: string | boolean | undefined) => {
        setFilters({
            ...filters,
            [key]: value,
        });
    };

    return {
        filters,
        setFilters,
        setFilter,
    };
};
