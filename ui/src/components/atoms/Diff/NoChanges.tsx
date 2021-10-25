import { FC } from 'react';
import { Box } from '@mui/material';

const NoChanges: FC = () => {
    return (
        <Box
            sx={{
                width: '100%',
                height: (theme) => theme.spacing(4),
                color: '#cccccc',
            }}
        >
            No Changes
        </Box>
    );
};

export default NoChanges;
