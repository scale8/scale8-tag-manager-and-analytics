import { useState } from 'react';
import { CancelConfirmDialogProps } from '../../types/props/CancelConfirmDialogProps';

const useCancelConfirmDialog = (): {
    dialogProps: CancelConfirmDialogProps;
    ask: (text: string, confirmHandler: () => void) => void;
} => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);

    const ask = (text: string, confirmHandler: () => void) => {
        setText(text);
        setOpen(true);
        setConfirmCallback(() => confirmHandler);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        confirmCallback && confirmCallback();
        setOpen(false);
    };

    const dialogProps: CancelConfirmDialogProps = {
        open,
        handleCancel,
        handleConfirm,
        text,
    };

    return { dialogProps, ask };
};

export { useCancelConfirmDialog };
