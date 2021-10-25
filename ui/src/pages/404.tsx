import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import Link from '../components/atoms/Next/Link';
import Head from 'next/head';

const NotFoundPage: FC = () => {
    return (
        <>
            <Head>
                <title>Scale8 - Not found</title>
                <meta name="description" content="Scale8 - Not found." />
            </Head>
            <Box
                minHeight="300px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                color="#cccccc"
            >
                <Typography variant="h1" component="div">
                    404
                </Typography>
                <Typography variant="h3" component="div">
                    Page not found
                </Typography>
                <Link href={'/login'} sx={{ color: '#aaaaaa', marginTop: '20px' }}>
                    Back to login
                </Link>
            </Box>
        </>
    );
};

export default NotFoundPage;
