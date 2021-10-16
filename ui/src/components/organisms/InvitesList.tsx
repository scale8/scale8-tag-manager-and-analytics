import { FC, Fragment } from 'react';

import {
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import makeStyles from '@mui/styles/makeStyles';
import Tooltip from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';
import DialogActionsWithCancel from '../molecules/DialogActionsWithCancel';
import { InvitesListProps } from '../../dialogPages/global/NotificationsInvites';

const useStyles = makeStyles(() => ({
    list: {
        paddingTop: '0',
    },
    listItem: {
        paddingRight: '93px',
    },
}));

const InvitesList: FC<InvitesListProps> = (props: InvitesListProps) => {
    const classes = useStyles();

    return (
        <Box display="flex" flexDirection="column">
            <Box height="328px" overflow="auto">
                <List className={classes.list}>
                    {props.invites.length === 0 ? (
                        <ListItem className={classes.listItem}>
                            <ListItemText primary="There are no invites to display" />
                        </ListItem>
                    ) : (
                        props.invites.map((invite) => (
                            <Fragment key={invite.id}>
                                <ListItem className={classes.listItem}>
                                    <ListItemText
                                        primary={`You've been invited to join the organization: ${invite.org.name}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <Tooltip title="Accept">
                                            <IconButton
                                                edge="end"
                                                aria-label="accept"
                                                onClick={() => {
                                                    props.acceptInviteAction(invite);
                                                }}
                                                size="large"
                                            >
                                                <CheckIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Decline">
                                            <IconButton
                                                edge="end"
                                                aria-label="decline"
                                                onClick={() => {
                                                    props.declineInviteAction(invite);
                                                }}
                                                size="large"
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider />
                            </Fragment>
                        ))
                    )}
                </List>
            </Box>
            <DialogActionsWithCancel handleDialogClose={props.handleDialogClose} />
        </Box>
    );
};

export { InvitesList };
