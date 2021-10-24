import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { FC } from 'react';

export const CircularProgressWithLabel: FC<
    CircularProgressProps & { value: number; forErrors?: boolean }
> = (props: CircularProgressProps & { value: number; forErrors?: boolean }) => {
    const { forErrors, ...circularProgressProps } = props;

    return (
        <Box position="relative" display="inline-flex">
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ color: (theme) => theme.palette.grey[100] }}
            >
                <CircularProgress
                    variant="determinate"
                    color="inherit"
                    size={props.size}
                    value={100}
                />
            </Box>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={forErrors ? '#c63d51' : '#44cce0'}
            >
                <CircularProgress
                    variant="determinate"
                    color="inherit"
                    {...circularProgressProps}
                />
            </Box>
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Box fontSize="inherit">{`${Math.round(props.value)}%`}</Box>
            </Box>
        </Box>
    );
};
