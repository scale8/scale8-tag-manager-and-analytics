import { makeStyles } from '@material-ui/core/styles';
import { FC, ReactNode } from 'react';
import ChartPeriodSelector from './ChartPeriodSelector';
import { IngestEndpointAnalyticsContentProps } from '../../types/props/IngestEndpointAnalyticsContentProps';

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

export type IngestAnalyticsPageContainerProps = IngestEndpointAnalyticsContentProps & {
    children: ReactNode;
    ticks: number;
};

const IngestAnalyticsPageContainer: FC<IngestAnalyticsPageContainerProps> = (
    props: IngestAnalyticsPageContainerProps,
) => {
    const classes = useStyles();

    const { children, ticks, ...ingestEndpointAnalyticsContentProps } = props;
    const { chartPeriodProps } = ingestEndpointAnalyticsContentProps;

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.left} />
                <div className={classes.right}>
                    <ChartPeriodSelector {...chartPeriodProps} ticks={ticks} type="endpoint" />
                </div>
            </div>
            <div className={classes.section}>{children}</div>
        </div>
    );
};

export default IngestAnalyticsPageContainer;
