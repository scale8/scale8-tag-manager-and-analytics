import { FC, ReactNode } from 'react';
import { Box } from '@mui/material';
import { snakeToTitleCase } from '../../../utils/TextUtils';

const FieldContainer: FC<{
    field: string;
    leftEmpty: boolean;
    rightEmpty: boolean;
    children?: ReactNode;
}> = ({ field, children, leftEmpty, rightEmpty }) => {
    const fieldFormatted = snakeToTitleCase(field);
    return (
        <div className="root">
            <Box
                sx={{
                    display: 'flex',
                    border: '1px solid #e1e4e8',
                }}
            >
                <Box
                    p={1}
                    sx={{
                        flex: '50%',
                        fontWeight: 'bold',
                        backgroundColor: '#f5f5f5',
                        color: leftEmpty ? '#999999' : '#24292e',
                        borderRight: '1px solid #e1e4e8',
                    }}
                >
                    {fieldFormatted}:
                </Box>
                <Box
                    p={1}
                    sx={{
                        flex: '50%',
                        fontWeight: 'bold',
                        backgroundColor: '#f5f5f5',
                        color: rightEmpty ? '#999999' : '#24292e',
                    }}
                >
                    {fieldFormatted}:
                </Box>
            </Box>
            <Box
                sx={{
                    border: '1px solid #e1e4e8',
                    borderTop: 0,
                }}
            >
                {children}
            </Box>
        </div>
    );
};

export default FieldContainer;
