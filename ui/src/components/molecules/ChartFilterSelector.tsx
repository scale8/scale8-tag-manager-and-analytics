import { FC } from 'react';
import { Chip } from '@material-ui/core';
import { AppQueryFilters } from '../../types/props/AppAnalyticsContentProps';
import { withStyles } from '@material-ui/core/styles';
import FilterListIcon from '@material-ui/icons/FilterList';

const FilterChip = withStyles({
    root: {
        marginRight: '8px',
        marginBottom: '8px',
        backgroundColor: 'transparent!important',
        borderRadius: '5px',
        padding: '19px 0',
        maxWidth: 508,
    },
    label: {
        paddingBottom: '2px',
        display: 'inline-block',
    },
})(Chip);

export type ChartFilterSelectorProps = {
    filters: AppQueryFilters;
    setFilter: (key: string, value: string | undefined) => void;
};

const mapFilterLabel = (filterKey: string, filters: AppQueryFilters): string => {
    switch (filterKey) {
        case 'referrer_tld':
            return 'Referrer';
        case 'referrer':
            if (filters.referrer_tld !== undefined) {
                return `"${filters.referrer_tld}" referrer`;
            }
            return 'Referrer';
        default:
            return filterKey;
    }
};

const ChartFilterSelector: FC<ChartFilterSelectorProps> = (props: ChartFilterSelectorProps) => {
    return (
        <>
            {Object.entries(props.filters).map(([key, value]) => {
                if (value === undefined || key === 'environment' || key === 'revision') {
                    return null;
                }
                return (
                    <FilterChip
                        icon={<FilterListIcon />}
                        variant="outlined"
                        key={key}
                        label={`${mapFilterLabel(key, props.filters)}: ${value}`}
                        onDelete={() => {
                            props.setFilter(key, undefined);
                        }}
                    />
                );
            })}
        </>
    );
};

export default ChartFilterSelector;
