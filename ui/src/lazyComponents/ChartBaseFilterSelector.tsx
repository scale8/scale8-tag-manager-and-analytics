import { ChangeEvent, FC } from 'react';
import { AppAnalyticsContentProps } from '../types/props/AppAnalyticsContentProps';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { useQuery } from '@apollo/client';
import { FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import PageAppChartBaseFilterQuery from '../gql/queries/PageAppChartBaseFilterQuery';
import { AppChartBaseData } from '../gql/generated/AppChartBaseData';
import { AppErrorContentProps } from '../types/props/AppErrorContentProps';

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

const ChartBaseFilterSelector: FC<AppAnalyticsContentProps | AppErrorContentProps> = (
    props: AppAnalyticsContentProps | AppErrorContentProps,
) => {
    const { appQueryOptions, id, setFilter } = props;

    const classes = useStyles();

    return queryLoaderAndError<AppChartBaseData>(
        false,
        useQuery<AppChartBaseData>(PageAppChartBaseFilterQuery, {
            variables: { id },
        }),
        (queryData: AppChartBaseData) => {
            const loadedEnvironments = queryData.getApp.environments;

            const currentEnvironmentKey = appQueryOptions.filter_options.environment ?? ' ';

            const handleEnvironmentChange = (e: ChangeEvent<{ value: unknown }>) => {
                if (e.target.value === ' ') {
                    setFilter('environment', undefined);
                } else {
                    setFilter('environment', e.target.value as string);
                }
            };

            const loadedRevisions = queryData.getApp.revisions;

            const currentRevisionKey = appQueryOptions.filter_options.revision ?? ' ';

            const handleRevisionChange = (e: ChangeEvent<{ value: unknown }>) => {
                if (e.target.value === ' ') {
                    setFilter('revision', undefined);
                } else {
                    setFilter('revision', e.target.value as string);
                }
            };

            return (
                <>
                    <FormControl
                        variant="outlined"
                        size="small"
                        className={classes.selectContainer}
                    >
                        <InputLabel id="environment-label">Environment</InputLabel>
                        <Select
                            labelId="environment-label"
                            classes={{ root: classes.selectRoot }}
                            value={currentEnvironmentKey}
                            onChange={handleEnvironmentChange}
                            label="Environment"
                        >
                            <MenuItem value={' '}>All Environments</MenuItem>
                            {loadedEnvironments.map((environment) => (
                                <MenuItem key={environment.id} value={environment.id}>
                                    {environment.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl
                        variant="outlined"
                        size="small"
                        className={classes.selectContainer}
                    >
                        <InputLabel id="revision-label">Revision</InputLabel>
                        <Select
                            labelId="revision-label"
                            classes={{ root: classes.selectRoot }}
                            value={currentRevisionKey}
                            onChange={handleRevisionChange}
                            label="Revision"
                        >
                            <MenuItem value={' '}>All Revisions</MenuItem>
                            {loadedRevisions.map((revision) => (
                                <MenuItem key={revision.id} value={revision.id}>
                                    {revision.name}
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

export default ChartBaseFilterSelector;
