import { FC } from 'react';
import { ChildrenOnlyProps } from '../../types/props/ChildrenOnlyProps';
import { Box, Card, Divider } from '@mui/material';

export const AppErrorsListContainer: FC<ChildrenOnlyProps> = (props: ChildrenOnlyProps) => {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '4px',
            }}
            elevation={0}
        >
            <Box
                bgcolor="#f5f5f5;"
                width="100%"
                height="48px"
                textAlign="center"
                lineHeight="48px"
                fontSize="12px"
            >
                ERRORS
            </Box>
            <Divider />

            <Box p={3} pb={1} height={400} overflow="auto">
                {props.children}
            </Box>
        </Card>
    );
};
