import { Dispatch, FC, SetStateAction } from 'react';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    lighten,
} from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { grey } from '@mui/material/colors';
import TextAreaInput from '../atoms/InputTypes/TextAreaInput';

const useStyles = makeStyles((theme) =>
    createStyles({
        dialogActions: {
            padding: theme.spacing(2),
            justifyContent: 'center',
        },
        cancel: {
            color: theme.palette.getContrastText(grey[700]),
            backgroundColor: grey[500],
            '&:hover': {
                backgroundColor: grey[700],
            },
        },
        confirm: {
            color: theme.palette.getContrastText(theme.palette.error.main),
            backgroundColor: lighten(theme.palette.error.main, 0.4),
            '&:hover': {
                backgroundColor: theme.palette.error.main,
            },
        },
    }),
);

type DeleteWithPreviewProps = {
    handleCancel: () => void;
    handleConfirm: () => void;
    comments: string;
    setComments: Dispatch<SetStateAction<string>>;
    text: string;
};

const DeleteCommentDialogContent: FC<DeleteWithPreviewProps> = (props: DeleteWithPreviewProps) => {
    const classes = useStyles();

    return (
        <>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{props.text}</DialogContentText>
                <Box marginTop={3} marginBottom={1}>
                    <TextAreaInput
                        style={{ width: '100%', minWidth: '300px' }}
                        name="comments"
                        label="Comments"
                        value={props.comments}
                        setValue={(v) => props.setComments(v)}
                    />
                </Box>
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <Button onClick={props.handleCancel} className={classes.cancel} autoFocus>
                    Cancel
                </Button>
                <Button onClick={props.handleConfirm} className={classes.confirm}>
                    Confirm
                </Button>
            </DialogActions>
        </>
    );
};

export default DeleteCommentDialogContent;
