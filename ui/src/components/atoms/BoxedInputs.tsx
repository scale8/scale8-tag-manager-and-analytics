import { FC, ReactNode } from 'react';
import { Box } from '@mui/material';

type BoxedInputsProps = {
    label: string;
    children?: ReactNode;
    errorColor?: boolean;
    background?: string;
    borderRadius?: number;
};

const BoxedInputs: FC<BoxedInputsProps> = (props: BoxedInputsProps) => {
    const background = props.background ?? '#ffffff';
    const borderRadius = props.borderRadius ?? 0;
    return (
        <Box
            mt={2}
            px={2}
            pt={3}
            sx={{
                border: (theme) =>
                    `1px solid ${props.errorColor ? theme.palette.error.main : '#e0e0e0'}`,
                borderRadius,
            }}
        >
            <Box position="relative">
                <Box
                    sx={{
                        color: (theme) => (props.errorColor ? theme.palette.error.main : '#9e9e9e'),
                    }}
                    bgcolor={background}
                    position="absolute"
                    mt={'-38px'}
                    px={1}
                >
                    {props.label}
                </Box>
            </Box>
            {props.children}
        </Box>
    );
};

export default BoxedInputs;
