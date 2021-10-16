import { FC } from 'react';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { grey } from '@mui/material/colors';

import { FinaliseRevision_finaliseRevision } from '../../gql/generated/FinaliseRevision';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: theme.spacing(0, 2, 1, 2),
        },
        dialogActions: {
            padding: theme.spacing(2),
            justifyContent: 'center',
        },
        cancel: {
            color: theme.palette.getContrastText(grey[900]),
            backgroundColor: grey[700],
            '&:hover': {
                backgroundColor: grey[900],
            },
        },
    }),
);

type FinalizeRevisionErrorDialogProps = {
    errors: FinaliseRevision_finaliseRevision[];
    handleClose: () => void;
};

const FinalizeRevisionErrorDialog: FC<FinalizeRevisionErrorDialogProps> = (
    props: FinalizeRevisionErrorDialogProps,
) => {
    const classes = useStyles();

    return (
        <>
            <DialogContent>
                <Box fontSize="h6.fontSize" minWidth={520}>
                    It was not possible to finalise the revision because of the following issues:
                </Box>

                <List>
                    {props.errors.map((error, key) => (
                        <ListItem key={key}>
                            <ListItemText
                                primary={
                                    error.gqlField === null ? (
                                        `Model: ${error.model}`
                                    ) : (
                                        <>
                                            {`Model: ${error.model}`}
                                            <br />
                                            {`Field: ${error.gqlField}`}
                                        </>
                                    )
                                }
                                secondary={error.issue}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <Button onClick={props.handleClose} className={classes.cancel} autoFocus>
                    Close
                </Button>
            </DialogActions>
        </>
    );
};

export default FinalizeRevisionErrorDialog;
