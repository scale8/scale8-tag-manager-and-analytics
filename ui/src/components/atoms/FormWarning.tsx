import { FC } from 'react';
import { Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

type FormWarningProps = {
    warning: string;
};

const FormWarning: FC<FormWarningProps> = ({ warning }) => {
    return (
        <Box
            component="small"
            sx={{
                display: 'flex',
                alignItems: 'center',
                color: (theme) => theme.palette.error.main,
                width: '100%',
                margin: (theme) => theme.spacing(0, 0, 3),
            }}
        >
            <WarningIcon
                sx={{
                    backgroundColor: 'transparent',
                    color: (theme) => theme.palette.error.main,
                    margin: '3px',
                }}
            />
            <Box pt="2px">{warning}</Box>
        </Box>
    );
};

export default FormWarning;
