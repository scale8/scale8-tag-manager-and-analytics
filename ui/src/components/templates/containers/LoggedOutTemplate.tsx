import { FC } from 'react';
import LoggedOutNavigationContainer from '../../atoms/LoggedOutNavigationContainer';
import { ChildrenOnlyProps } from '../../../types/props/ChildrenOnlyProps';
import { Box } from '@mui/material';

const LoggedOutTemplate: FC<ChildrenOnlyProps> = (props: ChildrenOnlyProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                minWidth: '320px',
                background: '#f9f9f9',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    flexShrink: 0,
                    width: '100%',
                }}
            >
                <LoggedOutNavigationContainer />
            </Box>
            <Box
                sx={{
                    flexShrink: 0,
                    width: '100%',
                }}
            >
                {props.children}
            </Box>
        </Box>
    );
};

export default LoggedOutTemplate;
