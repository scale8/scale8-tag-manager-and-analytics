import { FC } from 'react';
import { Typography } from '@mui/material';

type FormTitleProps = {
    title: string;
};

const FormTitle: FC<FormTitleProps> = (props: FormTitleProps) => {
    return (
        <Typography component="h1" variant="h5">
            {props.title}
        </Typography>
    );
};

export default FormTitle;
