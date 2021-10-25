import { FC } from 'react';
import { DialogActions } from '@mui/material';
import { DialogConfirmButton } from '../atoms/DialogConfirmButton';
import { DialogCancelButton } from '../atoms/DialogCancelButton';

type DialogActionsWithCancelProps = {
    confirmText?: string;
    handleDialogClose: (checkChanges: boolean) => void;
    disableSubmit?: boolean;
    ignoreChanges?: boolean;
};

const DialogActionsWithCancel: FC<DialogActionsWithCancelProps> = (
    props: DialogActionsWithCancelProps,
) => {
    return (
        <DialogActions sx={{ padding: 2, justifyContent: 'center' }}>
            <DialogCancelButton onClick={() => props.handleDialogClose(!props.ignoreChanges)}>
                Cancel
            </DialogCancelButton>
            {props.confirmText !== undefined && (
                <DialogConfirmButton type="submit" disabled={props.disableSubmit}>
                    {props.confirmText}
                </DialogConfirmButton>
            )}
        </DialogActions>
    );
};

export default DialogActionsWithCancel;
