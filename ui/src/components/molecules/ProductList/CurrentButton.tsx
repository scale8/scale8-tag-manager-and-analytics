import { FC } from 'react';
import { Button } from '@mui/material';

export const CurrentButton: FC = () => {
    return (
        <Button
            variant="contained"
            sx={{
                color: 'inherit',
                backgroundColor: '#eeeeee',
                width: '100%',
            }}
            color="inherit"
            disableElevation
            disabled
        >
            Current Plan
        </Button>
    );
};
