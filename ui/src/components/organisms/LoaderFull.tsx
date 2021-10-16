import { FC } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const LoaderFull: FC = () => {
    const classes = useStyles();

    return (
        <Backdrop open={true} className={classes.backdrop}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoaderFull;
