import { FC } from 'react';
import { Button, lighten } from '@mui/material';
import { ButtonProps } from '@mui/material/Button/Button';

export const DialogConfirmButton: FC<ButtonProps> = (props: ButtonProps) => {
    return (
        <Button
            sx={{
                color: (theme) => theme.palette.getContrastText('#0096a6'),
                backgroundColor: lighten('#0096a6', 0.4),
                '&:hover': {
                    backgroundColor: '#0096a6',
                },
                ...(props.sx ?? {}),
            }}
            {...props}
        >
            {props.children}
        </Button>
    );
};
