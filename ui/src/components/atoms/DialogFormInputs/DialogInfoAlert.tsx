import { Alert } from '@mui/material';
import { ChildrenOnlyProps } from '../../../types/props/ChildrenOnlyProps';
import { FC } from 'react';

export const DialogInfoAlert: FC<ChildrenOnlyProps> = ({ children }) => {
    return (
        <Alert severity="info" className="DialogFormField">
            {children}
        </Alert>
    );
};
