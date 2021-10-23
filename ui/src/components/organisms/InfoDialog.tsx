import { FC, ReactNode, useEffect } from 'react';
import { Dialog, DialogActions } from '@mui/material';
import { DialogBaseProps } from '../../types/DialogTypes';
import { useLoggedInState } from '../../context/AppContext';
import { DialogCancelButton } from '../atoms/DialogCancelButton';

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
                <DialogActions sx={{ padding: 2, justifyContent: 'center' }}>
                    <DialogCancelButton onClick={() => handleDialogClose(true)}>
                        Cancel
                    </DialogCancelButton>
                </DialogActions>,
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
