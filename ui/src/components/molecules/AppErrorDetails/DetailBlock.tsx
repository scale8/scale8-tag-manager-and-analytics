import { FC } from 'react';
import { ChildrenOnlyProps } from '../../../types/props/ChildrenOnlyProps';
import { Box } from '@mui/material';

export const DetailBlock: FC<ChildrenOnlyProps & { title: string }> = ({ children, title }) => {
    return (
        <Box
            sx={{
                flex: 1,
                padding: 2,
                marginBottom: 2,
                whiteSpace: 'break-spaces',
                wordBreak: 'break-all',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '4px',
                '&:first-of-type': {
                    marginRight: 1,
                },
                '&:last-of-type': {
                    marginLeft: 1,
                },
            }}
        >
            <Box position="relative">
                <Box
                    sx={{
                        color: 'rgba(0, 0, 0, 0.54)',
                        fontSize: '14px',
                        position: 'absolute',
                        marginLeft: '-2px',
                        marginTop: '-27px',
                        padding: '0px 3px',
                        backgroundColor: '#ffffff',
                    }}
                >
                    {title}
                </Box>
            </Box>
            {children}
        </Box>
    );
};
