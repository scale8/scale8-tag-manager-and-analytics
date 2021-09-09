import { makeStyles } from '@material-ui/core/styles';
import { FC, ReactNode } from 'react';
import ChartPeriodSelector from './ChartPeriodSelector';
import ChartFilterSelector from './ChartFilterSelector';
import ChartEventSelector from '../../lazyComponents/ChartEventSelector';
import { AppAnalyticsContentProps } from '../../types/props/AppAnalyticsContentProps';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(0, 2),
    },
    header: {
        padding: '20px 0 12px 0',
        display: 'flex',
        alignItems: 'top',
    },
    filters: {
        width: '100%',
        paddingBottom: '12px',
    },
    left: {
        flexGrow: 1,
    },
    right: {
        paddingBottom: theme.spacing(1),
    },
    section: {},
}));

export type AppAnalyticsPageContainerProps = AppAnalyticsContentProps & {
    children: ReactNode;
    ticks: number;
};

const AppAnalyticsPageContainer: FC<AppAnalyticsPageContainerProps> = (
    props: AppAnalyticsPageContainerProps,
) => {
    const classes = useStyles();

    const { children, ticks, ...appDashboardContentProps } = props;
    const { chartPeriodProps, appQueryOptions, setFilter } = appDashboardContentProps;

    const extractFilters = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { from, to, event, event_group, ...filters } = {
            ...appQueryOptions.filter_options,
        };
        return filters;
    };

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.left}>
                    <ChartEventSelector {...appDashboardContentProps} />
                </div>
                <div className={classes.right}>
                    <ChartPeriodSelector {...chartPeriodProps} ticks={ticks} type="app" />
                </div>
            </div>
            <div className={classes.filters}>
                <ChartFilterSelector filters={extractFilters()} setFilter={setFilter} />
            </div>
            <div className={classes.section}>{children}</div>
        </div>
    );
};

export default AppAnalyticsPageContainer;
