import { FC } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { AppAnalyticsContentProps } from '../../types/props/AppAnalyticsContentProps';
import { AppErrorContentProps } from '../../types/props/AppErrorContentProps';
import { WebTrafficType } from '../../gql/generated/globalTypes';
import { snakeToTitleCase } from '../../utils/TextUtils';

export const ChartWebTrafficTypeFilterSelector: FC<
    AppAnalyticsContentProps | AppErrorContentProps
> = (props: AppAnalyticsContentProps | AppErrorContentProps) => {
    const { appQueryOptions, setFilter } = props;
    const currentWebTrafficType = appQueryOptions.filter_options.traffic_type ?? ' ';

    const handleWebTrafficTypeFilterChange = (e: SelectChangeEvent) => {
        if (e.target.value === ' ') {
            setFilter('traffic_type', undefined);
        } else {
            setFilter('traffic_type', e.target.value as string);
        }
    };

    const selectRoot: SxProps<Theme> = {
        '&:focus': {
            backgroundColor: '#ffffff',
        },
        width: '130px',
    };

    const selectContainer: SxProps<Theme> = {
        marginRight: 2,
        marginBottom: 1,
    };

    return (
        <>
            <FormControl variant="outlined" size="small" sx={selectContainer}>
                <InputLabel id="bot-label">Traffic Type</InputLabel>
                <Select
                    labelId="bot-label"
                    sx={selectRoot}
                    value={currentWebTrafficType}
                    onChange={handleWebTrafficTypeFilterChange}
                    label="Traffic Type"
                >
                    <MenuItem value={' '}>All Traffic</MenuItem>
                    {Object.keys(WebTrafficType).map((key) => (
                        <MenuItem key={key} value={key}>
                            {snakeToTitleCase(key)} Traffic
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
};
