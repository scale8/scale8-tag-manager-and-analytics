import makeStyles from '@mui/styles/makeStyles';
import { FC } from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
    submit: {
        margin: theme.spacing(3, 0, 2),
        color: '#ffffff',
        backgroundColor: theme.palette.tagManagerColor.main,
        '&:hover': {
            color: '#ffffff',
            backgroundColor: theme.palette.tagManagerColor.main,
        },
    },
}));

const ExternalRedirectButton: FC<{ link: string; text: string }> = (props: {
    link: string;
    text: string;
}) => {
    const { link, text } = props;
    const router = useRouter();
    const classes = useStyles();

    return (
        <Button
            type="button"
            onClick={() => {
                router.push(link).then();
            }}
            fullWidth
            variant="contained"
            className={classes.submit}
        >
            {text}
        </Button>
    );
};

export default ExternalRedirectButton;
