import { FC, ReactNode, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { DialogBaseProps } from '../../types/DialogTypes';
import { useLoggedInState } from '../../context/AppContext';
import DialogActionsWithCancel from '../molecules/DialogActionsWithCancel';

const PageDialog: FC<DialogBaseProps> = (props: DialogBaseProps & { children?: ReactNode }) => {
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
                sx={{
                    '& .MuiDialog-paper': {
                        minWidth: '100px',
                        maxWidth: '700px',
                        '& .errorBox': { margin: 2 },
                    },
                }}
            >
                {children}
            </Dialog>
        </>
    );
};

export default PageDialog;
