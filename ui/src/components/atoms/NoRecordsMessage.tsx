import { FC } from 'react';
import { Box } from '@mui/material';

export const NoRecordsMessage: FC = () => {
    return (
        <Box width="100%">
            <Box display="flex" alignItems="center" justifyContent="center">
                <Box color="#777777">No records to display</Box>
            </Box>
        </Box>
    );
};
