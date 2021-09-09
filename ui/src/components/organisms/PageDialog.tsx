import { FC, ReactNode, useEffect } from 'react';
import { Dialog } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { DialogBaseProps } from '../../types/DialogTypes';
import { useLoggedInState } from '../../context/AppContext';
import DialogActionsWithCancel from '../molecules/DialogActionsWithCancel';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            minWidth: '100px',
            maxWidth: '700px',
            '& .errorBox': {
                margin: theme.spacing(2),
            },
        },
    }),
);

const PageDialog: FC<DialogBaseProps> = (props: DialogBaseProps & { children?: ReactNode }) => {
    const classes = useStyles();

    const { open, children, handleDialogClose } = props;

    const { teleport } = useLoggedInState();

    useEffect(() => {
        if (open) {
            teleport(
                'dialogErrorClose',
                <DialogActionsWithCancel handleDialogClose={handleDialogClose} />,
            );
        }
    }, [open]);

    return (
        <>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                classes={{
                    paper: classes.root,
                }}
            >
                {children}
            </Dialog>
        </>
    );
};

export default PageDialog;
