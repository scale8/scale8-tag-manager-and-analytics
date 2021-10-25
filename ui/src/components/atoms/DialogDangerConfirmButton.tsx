import { FC } from 'react';
import { Button, lighten } from '@mui/material';
import { ButtonProps } from '@mui/material/Button/Button';

export const DialogDangerConfirmButton: FC<ButtonProps> = (props: ButtonProps) => {
    return (
        <Button
            sx={{
                color: (theme) => theme.palette.getContrastText(theme.palette.error.main),
                backgroundColor: (theme) => lighten(theme.palette.error.main, 0.4),
                '&:hover': {
                    backgroundColor: (theme) => theme.palette.error.main,
                },

                ...(props.sx ?? {}),
            }}
            {...props}
        >
            {props.children}
        </Button>
    );
};
