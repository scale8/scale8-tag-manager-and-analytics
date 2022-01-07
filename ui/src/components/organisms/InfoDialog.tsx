import { FC, ReactNode, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { DialogBaseProps } from '../../types/DialogTypes';
import { useLoggedInState } from '../../context/AppContext';
import DialogActionsWithCancel from '../molecules/DialogActionsWithCancel';

type InfoDialogProps = DialogBaseProps & {
    children: ReactNode;
    fullscreen: boolean;
};

const InfoDialog: FC<InfoDialogProps> = (props: InfoDialogProps) => {
    const { open, children, handleDialogClose, fullscreen } = props;

    const { teleport } = useLoggedInState();

    useEffect(() => {
        if (open) {
            teleport(
                'dialogErrorClose',
                <DialogActionsWithCancel handleDialogClose={handleDialogClose} ignoreChanges />,
            );
        }
    }, [open]);

    return (
        <>
            <Dialog
                sx={{
                    '& .errorBox': {
                        margin: 2,
                    },
                    '& .MuiDialog-paper': fullscreen
                        ? {
                              minHeight: '90vh',
                              maxHeight: '90vh',
                              minWidth: '80vw',
                              maxWidth: '80vw',
                          }
                        : {
                              maxHeight: '90vh',
                              maxWidth: '80vw',
                              minWidth: '100px',
                          },
                }}
                onClose={handleDialogClose}
                open={open}
            >
                {children}
            </Dialog>
        </>
    );
};

export default InfoDialog;
