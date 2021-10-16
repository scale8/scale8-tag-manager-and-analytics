import { FC, ReactNode, useEffect } from 'react';
import { Button, Dialog, DialogActions } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { DialogBaseProps } from '../../types/DialogTypes';
import { grey } from '@mui/material/colors';
import { useLoggedInState } from '../../context/AppContext';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '& .errorBox': {
                margin: theme.spacing(2),
            },
        },
        dialogPaperFullscreen: {
            minHeight: '90vh',
            maxHeight: '90vh',
            minWidth: '80vw',
            maxWidth: '80vw',
        },
        dialogPaper: {
            maxHeight: '90vh',
            maxWidth: '80vw',
            minWidth: '100px',
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
    }),
);

type InfoDialogProps = DialogBaseProps & {
    children: ReactNode;
    fullscreen: boolean;
};

const InfoDialog: FC<InfoDialogProps> = (props: InfoDialogProps) => {
    const classes = useStyles();

    const { open, children, handleDialogClose, fullscreen } = props;

    const { teleport } = useLoggedInState();

    useEffect(() => {
        if (open) {
            teleport(
                'dialogErrorClose',
                <DialogActions className={classes.dialogActions}>
                    <Button onClick={() => handleDialogClose(true)} className={classes.cancel}>
                        Cancel
                    </Button>
                </DialogActions>,
            );
        }
    }, [open]);

    return (
        <>
            <Dialog
                className={classes.root}
                classes={
                    fullscreen
                        ? { paper: classes.dialogPaperFullscreen }
                        : { paper: classes.dialogPaper }
                }
                onClose={handleDialogClose}
                open={open}
            >
                {children}
            </Dialog>
        </>
    );
};

export default InfoDialog;
