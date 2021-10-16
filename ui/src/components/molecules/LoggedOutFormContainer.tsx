import { FC, PropsWithChildren } from 'react';
import { Box, Card } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
    contentBox: {
        margin: '20px auto',

        background: 'transparent',
        padding: theme.spacing(3),
    },
    card: {
        padding: theme.spacing(5),
    },
}));

const LoggedOutFormContainer: FC<PropsWithChildren<{ large?: boolean }>> = (
    props: PropsWithChildren<{ large?: boolean }>,
) => {
    const classes = useStyles();

    return (
        <Box className={classes.contentBox} maxWidth={props.large ? 600 : 500}>
            <Card className={classes.card} elevation={5}>
                {props.children}
            </Card>
        </Box>
    );
};

export default LoggedOutFormContainer;
