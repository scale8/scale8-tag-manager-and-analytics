import { Dispatch, FC, Fragment, SetStateAction } from 'react';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    lighten,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import TextAreaInput from '../atoms/InputTypes/TextAreaInput';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: theme.spacing(0, 2, 1, 2),
        },
        list: {
            padding: theme.spacing(0, 2),
        },
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
    textNoGroups: string;
    groups: { title: string; items: { name: string; id: string }[] }[];
    disableComments?: boolean;
};

const DeletePreviewDialogContent: FC<DeleteWithPreviewProps> = (props: DeleteWithPreviewProps) => {
    const classes = useStyles();

    return (
        <>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.groups.length === 0 ? props.textNoGroups : props.text}
                </DialogContentText>
                <List dense className={classes.list}>
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
                            style={{ width: '100%', minWidth: '300px' }}
                            name="comments"
                            label="Comments"
                            value={props.comments}
                            setValue={(v) => props.setComments(v)}
                        />
                    </Box>
                )}
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

export default DeletePreviewDialogContent;
