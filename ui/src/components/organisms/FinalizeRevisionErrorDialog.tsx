import { FC } from 'react';
import { Box, DialogActions, DialogContent, List, ListItem, ListItemText } from '@mui/material';

import { FinaliseRevision_finaliseRevision } from '../../gql/generated/FinaliseRevision';
import { DialogCancelButton } from '../atoms/DialogCancelButton';

type FinalizeRevisionErrorDialogProps = {
    errors: FinaliseRevision_finaliseRevision[];
    handleClose: () => void;
};

const FinalizeRevisionErrorDialog: FC<FinalizeRevisionErrorDialogProps> = (
    props: FinalizeRevisionErrorDialogProps,
) => {
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
            <DialogActions sx={{ padding: 2, justifyContent: 'center' }}>
                <DialogCancelButton onClick={props.handleClose} autoFocus>
                    Close
                </DialogCancelButton>
            </DialogActions>
        </>
    );
};

export default FinalizeRevisionErrorDialog;
