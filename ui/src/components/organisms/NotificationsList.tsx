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
import Tooltip from '@mui/material/Tooltip';
import DialogActionsWithCancel from '../molecules/DialogActionsWithCancel';
import { NotificationType } from '../../gql/generated/globalTypes';
import { NotificationsListProps } from '../../dialogPages/global/NotificationsNotifications';

const NotificationsList: FC<NotificationsListProps> = (props: NotificationsListProps) => {
    return (
        <Box display="flex" flexDirection="column">
            <Box height="328px" overflow="auto">
                <List sx={{ paddingTop: '0' }}>
                    {props.notifications.length === 0 ? (
                        <ListItem sx={{ maxWidth: '495px' }}>
                            <ListItemText primary="There are no notifications to display" />
                        </ListItem>
                    ) : (
                        props.notifications.map((notification) => (
                            <Fragment key={notification.id}>
                                <ListItem sx={{ maxWidth: '495px' }}>
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

export { NotificationsList };
