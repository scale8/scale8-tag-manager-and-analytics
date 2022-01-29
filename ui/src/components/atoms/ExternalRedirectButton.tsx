import { FC } from 'react';
import { Box, Button } from '@mui/material';

const ExternalRedirectButton: FC<{ onConfirm: () => void; text: string }> = (props: {
    onConfirm: () => void;
    text: string;
}) => {
    const { onConfirm, text } = props;

    return (
        <Box display="flex" justifyContent="center">
            <Button
                type="button"
                onClick={onConfirm}
                variant="contained"
                sx={{
                    margin: (theme) => theme.spacing(3, 0, 2),
                    color: '#ffffff',
                    backgroundColor: (theme) => theme.palette.tagManagerColor.main,
                    '&:hover': {
                        color: '#ffffff',
                        backgroundColor: (theme) => theme.palette.tagManagerColor.main,
                    },
                }}
            >
                {text}
            </Button>
        </Box>
    );
};

export default ExternalRedirectButton;
