import { FC } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { kebabToTitleCase } from '../../utils/TextUtils';

export const ChartEventSelectorContent: FC<{
    items: { key: string; count: number }[];
    groups: { key: string; count: number }[];
    handleEventChange: (e: SelectChangeEvent) => void;
    currentGroupKey: string;
    handleEventGroupChange: (e: SelectChangeEvent) => void;
    displayGroup: (group: { key: string; count: number }) => string;
    currentItemKey: string;
    isGroupFiltered: boolean;
}> = ({
    items,
    groups,
    handleEventChange,
    currentGroupKey,
    handleEventGroupChange,
    displayGroup,
    currentItemKey,
    isGroupFiltered,
}) => {
    return (
        <>
            <FormControl
                variant="outlined"
                size="small"
                sx={{
                    marginRight: 2,
                    marginBottom: 1,
                }}
            >
                <InputLabel id="event-label">Event Group</InputLabel>
                <Select
                    labelId="event-label"
                    sx={{
                        '&:focus': {
                            backgroundColor: '#ffffff',
                        },
                        width: '200px',
                    }}
                    value={currentGroupKey}
                    onChange={handleEventGroupChange}
                    label="Event Group"
                >
                    {groups.map((group) => (
                        <MenuItem key={group.key} value={group.key}>
                            {displayGroup(group)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl
                variant="outlined"
                size="small"
                sx={{
                    marginRight: 2,
                    marginBottom: 1,
                }}
            >
                <InputLabel id="event-label">Event</InputLabel>
                <Select
                    labelId="event-label"
                    sx={{
                        '&:focus': {
                            backgroundColor: '#ffffff',
                        },
                        width: '200px',
                    }}
                    value={currentItemKey}
                    onChange={handleEventChange}
                    label="Event"
                >
                    {isGroupFiltered && <MenuItem value=" ">All Events</MenuItem>}
                    {items
                        .filter((item) => !isGroupFiltered || item.count !== 0)
                        .map((item) => (
                            <MenuItem key={item.key} value={item.key}>
                                {kebabToTitleCase(item.key)} ({item.count})
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </>
    );
};
