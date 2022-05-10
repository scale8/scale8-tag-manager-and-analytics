import { FC } from 'react';
import { Alert } from '@mui/material';

export const DialogInfoAlert: FC = ({ children }) => {
    return (
        <Alert severity="info" className="DialogFormField">
            {children}
        </Alert>
    );
};
