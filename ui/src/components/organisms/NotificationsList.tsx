import { FC, Fragment } from 'react';
import {
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import DialogActionsWithCancel from '../molecules/DialogActionsWithCancel';
import { NotificationType } from '../../gql/generated/globalTypes';
import { NotificationsListProps } from '../../dialogPages/global/NotificationsNotifications';

const useStyles = makeStyles(() => ({
    list: {
        paddingTop: '0',
    },
    listItem: {
        maxWidth: '495px',
    },
}));

const NotificationsList: FC<NotificationsListProps> = (props: NotificationsListProps) => {
    const classes = useStyles();

    return (
        <Box display="flex" flexDirection="column">
            <Box height="328px" overflow="auto">
                <List className={classes.list}>
                    {props.notifications.length === 0 ? (
                        <ListItem className={classes.listItem}>
                            <ListItemText primary="There are no notifications to display" />
                        </ListItem>
                    ) : (
                        props.notifications.map((notification) => (
                            <Fragment key={notification.id}>
                                <ListItem className={classes.listItem}>
                                    <ListItemText
                                        primary={
                                            notification.type === NotificationType.WELCOME
                                                ? 'Welcome to Scale8.'
                                                : 'Unknown Notification'
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <Tooltip title="Dismiss">
                                            <IconButton
                                                edge="end"
                                                aria-label="dismiss"
                                                onClick={() => {
                                                    props.dismissNotificationAction(notification);
                                                }}
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

export { NotificationsList };
