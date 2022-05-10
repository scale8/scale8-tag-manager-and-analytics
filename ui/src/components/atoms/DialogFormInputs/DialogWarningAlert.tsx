import { FC } from 'react';
import { Alert } from '@mui/material';

export const DialogWarningAlert: FC = ({ children }) => {
    return (
        <Alert severity="warning" className="DialogFormField">
            {children}
        </Alert>
    );
};
