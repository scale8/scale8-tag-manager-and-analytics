import { FC } from 'react';
import { ChildrenOnlyProps } from '../../../types/props/ChildrenOnlyProps';
import { Box } from '@mui/material';

export const DetailTitle: FC<ChildrenOnlyProps> = (props: ChildrenOnlyProps) => {
    return (
        <Box
            sx={{
                marginBottom: 1,
                whiteSpace: 'break-spaces',
                wordBreak: 'break-all',
            }}
        >
            {props.children}
        </Box>
    );
};
