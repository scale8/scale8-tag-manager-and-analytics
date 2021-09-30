import { ChangeEvent, FC } from 'react';
import { AppAnalyticsContentProps } from '../types/props/AppAnalyticsContentProps';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { useQuery } from '@apollo/client';
import AppEventsQuery from '../gql/queries/AppEventsQuery';
import { AppEventsQueryData } from '../gql/generated/AppEventsQueryData';
import { FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import { kebabToTitleCase } from '../utils/TextUtils';

const useStyles = makeStyles((theme) => ({
    selectRoot: {
        '&:focus': {
            backgroundColor: '#ffffff',
        },
        width: '200px',
    },
    selectContainer: {
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
}));

const ChartEventSelector: FC<AppAnalyticsContentProps> = (props: AppAnalyticsContentProps) => {
    const { appQueryOptions, id, setFilter, setEventGroup } = props;

    const classes = useStyles();

    const extractFilters = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { event, ...filters } = {
            ...appQueryOptions.filter_options,
        };
        return filters;
    };

    const extractGroupFilters = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { event, event_group, ...filters } = {
            ...appQueryOptions.filter_options,
        };
        return filters;
    };

    return queryLoaderAndError<AppEventsQueryData>(
        false,
        useQuery<AppEventsQueryData>(AppEventsQuery, {
            variables: {
                id,
                appQueryOptions: {
                    time_slice: appQueryOptions.time_slice,
                    filter_options: extractFilters(),
                    limit: appQueryOptions.limit,
                },
                appQueryOptionsGroup: {
                    time_slice: appQueryOptions.time_slice,
                    filter_options: extractGroupFilters(),
                    limit: appQueryOptions.limit,
                },
            },
        }),
        (queryData: AppEventsQueryData) => {
            const loadedEvents = queryData.getApp.event_stats.result;

            const isGroupFiltered =
                appQueryOptions.filter_options.hasOwnProperty('event_group') &&
                appQueryOptions.filter_options.event_group !== undefined;

            const eventDefault = isGroupFiltered ? ' ' : 'page-view';

            const currentItemKey = appQueryOptions.filter_options.event ?? eventDefault;

            const items: {
                key: string;
                count: number;
            }[] = loadedEvents.map((_) => ({
                count: _.event_count,
                key: _.key,
            }));

            if (!items.some((_) => _.key === 'page-view')) {
                items.push({ key: 'page-view', count: 0 });
            }

            if (!items.some((_) => _.key === currentItemKey)) {
                if (currentItemKey !== ' ') {
                    items.push({ key: currentItemKey, count: 0 });
                }
            }

            const handleEventChange = (e: ChangeEvent<{ value: unknown }>) => {
                if (e.target.value === ' ') {
                    setFilter('event', undefined);
                } else {
                    setFilter('event', e.target.value as string);
                }
            };

            const loadedGroups = queryData.getApp.event_group_stats.result;

            const groups: {
                key: string;
                count: number;
            }[] = loadedGroups.map((_) => ({
                count: _.event_count,
                key: _.key,
            }));

            groups.push({ key: ' ', count: 0 });

            const currentGroupKey = appQueryOptions.filter_options.event_group ?? ' ';

            const handleEventGroupChange = (e: ChangeEvent<{ value: unknown }>) => {
                if (e.target.value === ' ') {
                    setEventGroup(undefined);
                } else {
                    setEventGroup(e.target.value as string);
                }
            };

            const displayGroup = (group: { key: string; count: number }) => {
                if (group.key === ' ') {
                    return 'All Groups';
                }
                return `${kebabToTitleCase(group.key)} (${group.count})`;
            };

            return (
                <>
                    <FormControl
                        variant="outlined"
                        size="small"
                        className={classes.selectContainer}
                    >
                        <InputLabel id="event-label">Event Group</InputLabel>
                        <Select
                            labelId="event-label"
                            classes={{ root: classes.selectRoot }}
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
                        className={classes.selectContainer}
                    >
                        <InputLabel id="event-label">Event</InputLabel>
                        <Select
                            labelId="event-label"
                            classes={{ root: classes.selectRoot }}
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
        },
        true,
        <></>,
        () => <></>,
    );
};

export default ChartEventSelector;
