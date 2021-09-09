import { FC } from 'react';
import { Button, DialogActions, lighten } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) =>
    createStyles({
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
            color: theme.palette.getContrastText('#0096a6'),
            backgroundColor: lighten('#0096a6', 0.4),
            '&:hover': {
                backgroundColor: '#0096a6',
            },
        },
    }),
);

type DialogActionsWithCancelProps = {
    confirmText?: string;
    handleDialogClose: (checkChanges: boolean) => void;
    disableSubmit?: boolean;
    ignoreChanges?: boolean;
};

const DialogActionsWithCancel: FC<DialogActionsWithCancelProps> = (
    props: DialogActionsWithCancelProps,
) => {
    const classes = useStyles();

    return (
        <DialogActions className={classes.dialogActions}>
            <Button
                onClick={() => props.handleDialogClose(!props.ignoreChanges)}
                className={classes.cancel}
            >
                Cancel
            </Button>
            {props.confirmText !== undefined && (
                <Button type="submit" className={classes.confirm} disabled={props.disableSubmit}>
                    {props.confirmText}
                </Button>
            )}
        </DialogActions>
    );
};

export default DialogActionsWithCancel;
