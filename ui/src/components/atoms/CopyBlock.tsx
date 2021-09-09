import { FC, MouseEvent, SyntheticEvent, useState } from 'react';
import { Box, Paper, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { CopyBlockProps } from '../../types/props/CopyBlockProps';
import LazyHighlight from './LibraryLoaders/LazyHighlight';

const useStyles = makeStyles(() =>
    createStyles({
        copy: {
            position: 'absolute',
            right: 0,
            cursor: 'pointer',
            color: '#ffffff',
            '&:hover': {
                backgroundColor: 'rgba(254, 254, 254, 0.12)',
            },
            padding: '6px 5px 2px',
        },
        code: {
            '& pre': {
                margin: 0,
            },
        },
    }),
);

const CopyBlock: FC<CopyBlockProps> = (props: CopyBlockProps) => {
    const classes = useStyles();
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
        <Paper elevation={props.flat !== undefined && props.flat ? 0 : 5}>
            <Box
                my={props.flat !== undefined && props.flat ? 0 : 2}
                pr="26px"
                fontSize={12}
                fontWeight="bold"
                position="relative"
                bgcolor="#002b36"
                border={1}
                borderColor="#002b36"
                className={classes.code}
            >
                <div onClick={handleClick} className={classes.copy}>
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
                </div>
                <LazyHighlight language={props.language} code={props.text} />
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
