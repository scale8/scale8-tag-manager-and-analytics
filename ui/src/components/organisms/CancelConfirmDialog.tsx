import { FC } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    lighten,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { CancelConfirmDialogProps } from '../../types/props/CancelConfirmDialogProps';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: theme.spacing(0, 2, 1, 2),
        },
        dialogActions: {
            padding: theme.spacing(2),
            justifyContent: 'center',
        },
        cancel: {
            color: theme.palette.getContrastText(grey[700]),
            backgroundColor: grey[500],
            '&:hover': {
                backgroundColor: grey[700],
            },
        },
        confirm: {
            color: theme.palette.getContrastText(theme.palette.error.main),
            backgroundColor: lighten(theme.palette.error.main, 0.4),
            '&:hover': {
                backgroundColor: theme.palette.error.main,
            },
        },
    }),
);

const CancelConfirmDialog: FC<CancelConfirmDialogProps> = (props: CancelConfirmDialogProps) => {
    const classes = useStyles();

    return (
        <Dialog
            open={props.open}
            onClose={props.handleCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            classes={{
                paper: classes.root,
            }}
        >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{props.text}</DialogContentText>
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <Button onClick={props.handleCancel} className={classes.cancel} autoFocus>
                    Cancel
                </Button>
                <Button onClick={props.handleConfirm} className={classes.confirm}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelConfirmDialog;
