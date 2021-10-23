import { FC } from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

const ExternalRedirectButton: FC<{ link: string; text: string }> = (props: {
    link: string;
    text: string;
}) => {
    const { link, text } = props;
    const router = useRouter();

    return (
        <Button
            type="button"
            onClick={() => {
                router.push(link).then();
            }}
            fullWidth
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
    );
};

export default ExternalRedirectButton;
