import { FC } from 'react';
import { ChildrenOnlyProps } from '../../../types/props/ChildrenOnlyProps';
import { Box, Card, Divider, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const AppErrorDetailsContainer: FC<ChildrenOnlyProps & { removeFilter: () => void }> = ({
    children,
    removeFilter,
}) => {
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
                lineHeight="48px"
                fontSize="12px"
                position="relative"
            >
                <IconButton
                    size="small"
                    disableRipple
                    onClick={removeFilter}
                    style={{
                        position: 'absolute',
                        marginTop: '9px',
                        marginLeft: '10px',
                        backgroundColor: 'transparent',
                    }}
                >
                    <ArrowBackIcon fontSize="inherit" />
                </IconButton>
                <Box textAlign="center" width="100%">
                    ERROR DETAILS
                </Box>
            </Box>
            <Divider />

            <Box p={3} pb={1}>
                {children}
            </Box>
        </Card>
    );
};
