import { FC, FormEvent, ReactNode } from 'react';
import { Box } from '@mui/material';

type FormFlexProps = {
    children: ReactNode;
    handleSubmit: (event?: FormEvent<HTMLFormElement>) => void;
};

const FormFlex: FC<FormFlexProps> = ({ children, handleSubmit }) => {
    return (
        <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                '& .DrawerFormField': {
                    width: '100%',
                    margin: (theme) => theme.spacing(0, 0, 3),
                },
            }}
            onSubmit={handleSubmit}
        >
            {children}
        </Box>
    );
};

export default FormFlex;
