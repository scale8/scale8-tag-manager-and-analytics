import { FC, ReactNode } from 'react';
import Logo from './Logo';
import { Box, Container, Toolbar } from '@mui/material';
import Link from './Next/Link';

const LoggedOutNavigationContainer: FC<{ children?: ReactNode }> = (props: {
    children?: ReactNode;
}) => {
    return (
        <Container disableGutters>
            <Toolbar
                sx={{
                    minHeight: '100px !important',
                    flexWrap: 'wrap',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        zIndex: (theme) => theme.zIndex.drawer + 2,
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                        height: '56px',
                        '& a': {
                            color: 'rgba(0, 0, 0, 0.6)',
                            textDecoration: 'none !important',
                            marginLeft: '15px',
                            fontWeight: 600,
                            fontSize: '20px',
                            '&:hover': {
                                textDecoration: 'none !important',
                                color: 'rgba(0, 0, 0, 0.4)',
                            },
                        },
                    }}
                >
                    <Logo width={30} />
                    <Link href="https://scale8.com/">Scale8</Link>
                </Box>
                {props.children}
            </Toolbar>
        </Container>
    );
};

export default LoggedOutNavigationContainer;
