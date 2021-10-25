import { FC } from 'react';
import Alert from '@mui/material/Alert';

type GenericErrorProps = {
    error: string;
};

const GenericError: FC<GenericErrorProps> = (props: GenericErrorProps) => {
    return (
        <>
            <Alert severity="error">{props.error}</Alert>
        </>
    );
};

export default GenericError;
