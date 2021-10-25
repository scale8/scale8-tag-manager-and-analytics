import { FC, ReactNode } from 'react';
import { Box, Theme } from '@mui/material';
import { SxProps } from '@mui/system';

type MainDiffContainerProps = {
    prefix?: string;
    leftName?: string;
    rightName?: string;
    leftId: string;
    rightId: string;
    children?: ReactNode;
};

const MainDiffContainer: FC<MainDiffContainerProps> = (props: MainDiffContainerProps) => {
    const { prefix, leftName, rightName, leftId, rightId, children } = props;

    const objectTitleSide: SxProps<Theme> = {
        flex: '50%',
        padding: (theme) => theme.spacing(1),
        backgroundColor: '#ffffff',
        wordBreak: 'break-word',
        '& small': {
            color: '#666666',
        },
    };

    return (
        <Box
            sx={{
                borderRadius: '4px',
                border: '1px solid #e1e4e8',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    fontSize: '1.1em',
                    borderBottom: '1px solid #e1e4e8',
                }}
            >
                <Box
                    sx={{
                        ...objectTitleSide,
                        borderRadius: '4px 0 0 0',
                        borderRight: '1px solid #e1e4e8',
                    }}
                >
                    {prefix && <span>{prefix} </span>}
                    {leftName ? (
                        <span>
                            {leftName} <small>({leftId})</small>
                        </span>
                    ) : (
                        <span>{leftId}</span>
                    )}
                </Box>
                <Box
                    sx={{
                        ...objectTitleSide,
                        borderRadius: '0 4px 0 0',
                    }}
                >
                    {prefix && <span>{prefix} </span>}
                    {rightName ? (
                        <span>
                            {rightName} <small>({rightId})</small>
                        </span>
                    ) : (
                        <span>{rightId}</span>
                    )}
                </Box>
            </Box>
            <Box
                sx={{
                    padding: (theme) => theme.spacing(1, 1, 0),
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default MainDiffContainer;
