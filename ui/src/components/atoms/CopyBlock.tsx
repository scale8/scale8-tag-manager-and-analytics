import { FC, MouseEvent, SyntheticEvent, useState } from 'react';
import { Box, Paper, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import { CopyBlockProps } from '../../types/props/CopyBlockProps';
import LazyShiki from './LibraryLoaders/LazyShiki';

const CopyBlock: FC<CopyBlockProps> = (props: CopyBlockProps) => {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleClick = () => {
        setOpen(true);
        setCopied(false);
        (async () => {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(props.text);
                setCopied(true);
            }
        })();
    };

    const handleClose = (event: SyntheticEvent | MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Paper elevation={props.flat !== undefined && props.flat ? 0 : 5} sx={{ height: '100%' }}>
            <Box
                height="100%"
                my={props.flat !== undefined && props.flat ? 0 : 2}
                pr="26px"
                fontSize={12}
                fontWeight="bold"
                position="relative"
                bgcolor="#2e3440"
                border={1}
                borderColor="#2e3440"
                sx={{
                    '& pre': {
                        margin: 0,
                    },
                }}
            >
                <Box
                    onClick={handleClick}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        cursor: 'pointer',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: 'rgba(254, 254, 254, 0.12)',
                        },
                        padding: '6px 5px 2px',
                    }}
                >
                    <svg
                        focusable="false"
                        width="16"
                        height="16"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                    >
                        <path
                            d="M28,10V28H10V10H28m0-2H10a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V10a2,2,0,0,0-2-2Z"
                            fill="currentColor"
                        />
                        <path d="M4,18H2V4A2,2,0,0,1,4,2H18V4H4Z" fill="currentColor" />
                    </svg>
                </Box>
                <Box height="100%">
                    <LazyShiki language={props.language} code={props.text} smallText />
                </Box>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={open}
                    autoHideDuration={1000}
                    onClose={handleClose}
                >
                    {copied ? (
                        <Alert severity="success">Copied to clipboard.</Alert>
                    ) : (
                        <Alert severity="error">
                            Copy to clipboard functionality not available.
                        </Alert>
                    )}
                </Snackbar>
            </Box>
        </Paper>
    );
};

export default CopyBlock;
