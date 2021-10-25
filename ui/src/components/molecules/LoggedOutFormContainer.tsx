import { FC, PropsWithChildren } from 'react';
import { Box, Card } from '@mui/material';

const LoggedOutFormContainer: FC<PropsWithChildren<{ large?: boolean }>> = (
    props: PropsWithChildren<{ large?: boolean }>,
) => {
    return (
        <Box
            sx={{ margin: '20px auto', background: 'transparent', padding: 3 }}
            maxWidth={props.large ? 600 : 500}
        >
            <Card sx={{ padding: 5 }} elevation={5}>
                {props.children}
            </Card>
        </Box>
    );
};

export default LoggedOutFormContainer;
