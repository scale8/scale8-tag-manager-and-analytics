import { FC } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    lighten,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { CancelConfirmDialogProps } from '../../types/props/CancelConfirmDialogProps';

const CancelConfirmDialog: FC<CancelConfirmDialogProps> = (props: CancelConfirmDialogProps) => {
    return (
        <Dialog
            open={props.open}
            onClose={props.handleCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                '& .MuiDialog-paper': {
                    padding: (theme) => theme.spacing(0, 2, 1, 2),
                },
            }}
        >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{props.text}</DialogContentText>
            </DialogContent>
            <DialogActions
                sx={{
                    padding: 2,
                    justifyContent: 'center',
                }}
            >
                <Button
                    onClick={props.handleCancel}
                    sx={{
                        color: (theme) => theme.palette.getContrastText(grey[700]),
                        backgroundColor: grey[500],
                        '&:hover': {
                            backgroundColor: grey[700],
                        },
                    }}
                    autoFocus
                >
                    Cancel
                </Button>
                <Button
                    onClick={props.handleConfirm}
                    sx={{
                        color: (theme) => theme.palette.getContrastText(theme.palette.error.main),
                        backgroundColor: (theme) => lighten(theme.palette.error.main, 0.4),
                        '&:hover': {
                            backgroundColor: (theme) => theme.palette.error.main,
                        },
                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelConfirmDialog;
