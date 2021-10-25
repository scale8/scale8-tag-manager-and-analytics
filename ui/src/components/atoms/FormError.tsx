import { FC } from 'react';
import Alert from '@mui/material/Alert';

type FormErrorProps = {
    error: string;
};

const FormError: FC<FormErrorProps> = (props: FormErrorProps) => {
    return (
        <>
            <Alert severity="error">{props.error}</Alert>
        </>
    );
};

export default FormError;
