import { ElementType, FC, ReactNode, Ref } from 'react';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

export const SxBox: FC<{
    children?: ReactNode;
    component?: ElementType;
    ref?: Ref<unknown>;
    sx: SxProps<Theme>;
}> = ({ children, component, ref, sx }) => {
    return (
        <Box sx={sx} component={component} ref={ref}>
            {children}
        </Box>
    );
};
