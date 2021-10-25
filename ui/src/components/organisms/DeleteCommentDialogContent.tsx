import { Dispatch, FC, SetStateAction } from 'react';
import { Box, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import TextAreaInput from '../atoms/InputTypes/TextAreaInput';
import { DialogDangerConfirmButton } from '../atoms/DialogDangerConfirmButton';
import { DialogCancelButton } from '../atoms/DialogCancelButton';

type DeleteWithPreviewProps = {
    handleCancel: () => void;
    handleConfirm: () => void;
    comments: string;
    setComments: Dispatch<SetStateAction<string>>;
    text: string;
};

const DeleteCommentDialogContent: FC<DeleteWithPreviewProps> = (props: DeleteWithPreviewProps) => {
    return (
        <>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{props.text}</DialogContentText>
                <Box marginTop={3} marginBottom={1}>
                    <TextAreaInput
                        sx={{ width: '100%', minWidth: '300px' }}
                        name="comments"
                        label="Comments"
                        value={props.comments}
                        setValue={(v) => props.setComments(v)}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: 2, justifyContent: 'center' }}>
                <DialogCancelButton onClick={props.handleCancel} autoFocus>
                    Cancel
                </DialogCancelButton>
                <DialogDangerConfirmButton onClick={props.handleConfirm}>
                    Confirm
                </DialogDangerConfirmButton>
            </DialogActions>
        </>
    );
};

export default DeleteCommentDialogContent;
