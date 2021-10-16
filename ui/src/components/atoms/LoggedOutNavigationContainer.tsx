import { FC, ReactNode } from 'react';
import Logo from './Logo';
import { Container, Toolbar } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Link from './Next/Link';

const useStyles = makeStyles((theme) => ({
    toolbar: {
        minHeight: '100px',
        flexWrap: 'wrap',
    },
    logo: {
        position: 'absolute',
        zIndex: theme.zIndex.drawer + 2,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        height: '56px',
        '& a': {
            color: 'rgba(0, 0, 0, 0.6)',
            marginLeft: '15px',
            fontWeight: 600,
            fontSize: '20px',
            '&:hover': {
                textDecoration: 'none',
                color: 'rgba(0, 0, 0, 0.4)',
            },
        },
    },
}));

const LoggedOutNavigationContainer: FC<{ children?: ReactNode }> = (props: {
    children?: ReactNode;
}) => {
    const classes = useStyles();
    return (
        <Container disableGutters>
            <Toolbar className={classes.toolbar}>
                <div className={classes.logo}>
                    <Logo width={30} />
                    <Link href="https://scale8.com/">Scale8</Link>
                </div>
                {props.children}
            </Toolbar>
        </Container>
    );
};

export default LoggedOutNavigationContainer;
