import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { FC } from 'react';
import { useTheme } from '@material-ui/core';

export const CircularProgressWithLabel: FC<
    CircularProgressProps & { value: number; forErrors?: boolean }
> = (props: CircularProgressProps & { value: number; forErrors?: boolean }) => {
    const theme = useTheme();

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
                color={theme.palette.grey[100]}
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
                color={props.forErrors ? '#c63d51' : '#44cce0'}
            >
                <CircularProgress variant="determinate" color="inherit" {...props} />
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
