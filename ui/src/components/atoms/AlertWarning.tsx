import { FC } from 'react';
import { Alert } from '@mui/material';
import { AlertProps } from '@mui/material/Alert/Alert';

export const AlertWarning: FC<AlertProps> = (props: AlertProps) => {
    return <Alert {...props} severity="warning" />;
};
