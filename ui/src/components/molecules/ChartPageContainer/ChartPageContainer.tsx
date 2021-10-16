import makeStyles from '@mui/styles/makeStyles';
import { FC, ReactNode } from 'react';
import { AppQueryFilterOptions } from '../../../gql/generated/globalTypes';

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

export type ChartPageContainerProps = {
    leftHeaderBlock: ReactNode;
    rightHeaderBlock: ReactNode;
    secondaryBlock: ReactNode;
};

export const extractFilters = (filter_options: AppQueryFilterOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { from, to, event, event_group, ...filters } = {
        ...filter_options,
    };
    return filters;
};

const ChartPageContainer: FC<ChartPageContainerProps & { children: ReactNode }> = (
    props: ChartPageContainerProps & { children: ReactNode },
) => {
    const classes = useStyles();

    const { children, leftHeaderBlock, rightHeaderBlock, secondaryBlock } = props;

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.left}>{leftHeaderBlock}</div>
                <div className={classes.right}>{rightHeaderBlock}</div>
            </div>
            <div className={classes.filters}>{secondaryBlock}</div>
            <div className={classes.section}>{children}</div>
        </div>
    );
};

export default ChartPageContainer;
