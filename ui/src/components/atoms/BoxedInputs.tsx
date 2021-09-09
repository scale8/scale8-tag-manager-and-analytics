import { FC, ReactNode } from 'react';
import { Box } from '@material-ui/core';

type BoxedInputsProps = {
    label: string;
    children?: ReactNode;
    color?: string;
    background?: string;
    borderRadius?: number;
};

const BoxedInputs: FC<BoxedInputsProps> = (props: BoxedInputsProps) => {
    const background = props.background ?? '#ffffff';
    const borderColor = props.color ?? '#e0e0e0';
    const color = props.color ?? '#9e9e9e';
    const borderRadius = props.borderRadius ?? 0;
    return (
        <Box mt={2} px={2} pt={3} border={1} borderColor={borderColor} borderRadius={borderRadius}>
            <Box position="relative">
                <Box color={color} bgcolor={background} position="absolute" mt={'-38px'} px={1}>
                    {props.label}
                </Box>
            </Box>
            {props.children}
        </Box>
    );
};

export default BoxedInputs;
