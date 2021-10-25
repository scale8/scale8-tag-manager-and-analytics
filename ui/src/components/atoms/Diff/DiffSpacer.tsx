import { FC } from 'react';
import { Box } from '@mui/material';

const DiffSpacer: FC<{
    height: number;
}> = ({ height }) => {
    return (
        <Box
            sx={{
                width: '100%',
                height: (theme) => theme.spacing(height),
            }}
        />
    );
};

export default DiffSpacer;
