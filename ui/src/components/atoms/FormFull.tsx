import { FC, FormEvent, ReactNode } from 'react';
import { Box } from '@mui/material';

type FormFullProps = {
    children: ReactNode;
    handleSubmit: (event?: FormEvent<HTMLFormElement>) => void;
};

const FormFull: FC<FormFullProps> = ({ children, handleSubmit }) => {
    return (
        <Box
            component="form"
            sx={{
                width: '100%', // Fix IE 11 issue.
                '& .formFullSubmit': {
                    margin: (theme) => theme.spacing(3, 0, 2),
                },
                '& .formFullMainColorSubmit': {
                    margin: (theme) => theme.spacing(3, 0, 2),
                    color: '#ffffff',
                    backgroundColor: (theme) => theme.palette.commonColor.main,
                    '&:hover': {
                        color: '#ffffff',
                        backgroundColor: (theme) => theme.palette.commonColor.main,
                    },
                },
                '& .formFullTMColorSubmit': {
                    margin: (theme) => theme.spacing(3, 0, 2),
                    color: '#ffffff',
                    backgroundColor: (theme) => theme.palette.tagManagerColor.main,
                    '&:hover': {
                        color: '#ffffff',
                        backgroundColor: (theme) => theme.palette.tagManagerColor.main,
                    },
                },
                '& .formFullDMColorSubmit': {
                    margin: (theme) => theme.spacing(3, 0, 2),
                    color: '#ffffff',
                    backgroundColor: (theme) => theme.palette.dataManagerColor.main,
                    '&:hover': {
                        color: '#ffffff',
                        backgroundColor: (theme) => theme.palette.dataManagerColor.main,
                    },
                },
            }}
            onSubmit={handleSubmit}
        >
            {children}
        </Box>
    );
};

export default FormFull;
