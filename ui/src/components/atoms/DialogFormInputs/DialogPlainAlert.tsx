import { FC } from 'react';
import { Box } from '@mui/material';

type DialogPlainAlertProps = {
    realignTop?: boolean;
};

export const DialogPlainAlert: FC<DialogPlainAlertProps> = ({ children, realignTop }) => {
    return (
        <Box
            component="small"
            className="DialogFormField"
            sx={realignTop ? { marginTop: '-24px' } : {}}
        >
            {children}
        </Box>
    );
};
