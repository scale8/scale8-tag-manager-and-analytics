import { FC } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

const LoaderFull: FC = () => {
    return (
        <Backdrop
            open={true}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                color: '#fff',
            }}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoaderFull;
