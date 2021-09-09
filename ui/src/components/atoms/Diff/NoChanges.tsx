import { FC } from 'react';

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: theme.spacing(4),
            color: '#cccccc',
        },
    }),
);

const NoChanges: FC = () => {
    const classes = useStyles();
    return <div className={classes.root}>No Changes</div>;
};

export default NoChanges;
