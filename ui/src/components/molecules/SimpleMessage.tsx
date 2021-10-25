import { FC, ReactNode } from 'react';
import { Box, DialogContent } from '@mui/material';
import DialogActionsWithCancel from './DialogActionsWithCancel';

type SimpleMessageProps = {
    children: ReactNode;
    handleDialogClose: (checkChanges: boolean) => void;
};

const SimpleMessage: FC<SimpleMessageProps> = (props: SimpleMessageProps) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <DialogContent sx={{ minHeight: '100px' }}>{props.children}</DialogContent>
            <DialogActionsWithCancel handleDialogClose={props.handleDialogClose} />
        </Box>
    );
};

export default SimpleMessage;
