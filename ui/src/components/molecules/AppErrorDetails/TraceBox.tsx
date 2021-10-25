import { FC } from 'react';
import { Box, Paper } from '@mui/material';
import { DetailTitle } from './DetailTitle';

export const TraceBox: FC<{ trace: string }> = ({ trace }) => {
    return (
        <>
            <DetailTitle>
                <b>Stack trace:</b>
            </DetailTitle>
            <Box zIndex={1} height={250}>
                <Paper
                    elevation={5}
                    sx={{
                        height: 250,
                        backgroundColor: '#2e3440',
                        zIndex: 2,
                        borderRadius: 0,
                    }}
                >
                    <Box
                        component="pre"
                        sx={{
                            position: 'relative',
                            display: 'block',
                            height: '100%',
                            overflowY: 'auto',
                            backgroundColor: '#2e3440ff',
                            margin: 0,
                            color: 'rgb(216, 222, 233)',
                            padding: 1,
                            '&::-webkit-scrollbar': {
                                width: '8px',
                                height: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#f1f1f1',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#888',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                backgroundColor: '#555',
                            },
                            fontSize: 15,
                            whiteSpace: 'break-spaces',
                            wordBreak: 'break-all',
                        }}
                    >
                        {trace}
                    </Box>
                </Paper>
            </Box>
        </>
    );
};
