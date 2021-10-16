import { FC } from 'react';

import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

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
