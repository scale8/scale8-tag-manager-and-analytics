import { FC } from 'react';
import { Button } from '@mui/material';
import { ButtonProps } from '@mui/material/Button/Button';
import { grey } from '@mui/material/colors';

export const DialogCancelButton: FC<ButtonProps> = (props: ButtonProps) => {
    return (
        <Button
            sx={{
                color: (theme) => theme.palette.getContrastText(grey[700]),
                backgroundColor: grey[500],
                '&:hover': {
                    backgroundColor: grey[700],
                },
                ...(props.sx ?? {}),
            }}
            {...props}
        >
            {props.children}
        </Button>
    );
};
