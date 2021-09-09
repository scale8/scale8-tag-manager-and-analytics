export type CancelConfirmDialogProps = {
    open: boolean;
    handleCancel: () => void;
    handleConfirm: () => void;
    text: string;
};
