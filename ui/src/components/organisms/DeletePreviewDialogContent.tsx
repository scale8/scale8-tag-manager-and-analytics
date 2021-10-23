import { Dispatch, FC, Fragment, SetStateAction } from 'react';
import {
    Box,
    DialogActions,
    DialogContent,
    DialogContentText,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import TextAreaInput from '../atoms/InputTypes/TextAreaInput';
import { DialogDangerConfirmButton } from '../atoms/DialogDangerConfirmButton';
import { DialogCancelButton } from '../atoms/DialogCancelButton';

type DeleteWithPreviewProps = {
    handleCancel: () => void;
    handleConfirm: () => void;
    comments: string;
    setComments: Dispatch<SetStateAction<string>>;
    text: string;
    textNoGroups: string;
    groups: { title: string; items: { name: string; id: string }[] }[];
    disableComments?: boolean;
};

const DeletePreviewDialogContent: FC<DeleteWithPreviewProps> = (props: DeleteWithPreviewProps) => {
    return (
        <>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.groups.length === 0 ? props.textNoGroups : props.text}
                </DialogContentText>
                <List
                    dense
                    sx={{
                        padding: (theme) => theme.spacing(0, 2),
                    }}
                >
                    {props.groups.map((group, key) => (
                        <Fragment key={key}>
                            <ListItemText secondary={group.title} />
                            {group.items.map((item, key) => (
                                <ListItem key={key}>
                                    <ListItemText primary={`${item.name} (${item.id})`} />
                                </ListItem>
                            ))}
                        </Fragment>
                    ))}
                </List>
                {props.disableComments && (
                    <Box marginTop={3} marginBottom={1}>
                        <TextAreaInput
                            sx={{ width: '100%', minWidth: '300px' }}
                            name="comments"
                            label="Comments"
                            value={props.comments}
                            setValue={(v) => props.setComments(v)}
                        />
                    </Box>
                )}
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

export default DeletePreviewDialogContent;
