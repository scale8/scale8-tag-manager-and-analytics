import { useState } from 'react';
import { FC } from 'react';
import { useQuery } from '@apollo/client';
import LoggedUserQuery from '../../gql/queries/LoggedUserQuery';
import { LoggedUser, LoggedUser_me_user_notifications } from '../../gql/generated/LoggedUser';
import { DialogPageProps } from '../../types/DialogTypes';
import { QueryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import { NotificationsList } from '../../components/organisms/NotificationsList';
import DismissUserNotificationQuery from '../../gql/mutations/DismissUserNotificationQuery';
import { DialogMutationFunction } from '../abstractions/DialogDirectMutation';
import { InDialogMutation } from '../abstractions/InDialogMutation';

export type NotificationsListProps = DialogPageProps & {
    notifications: LoggedUser_me_user_notifications[];
    dismissNotificationAction: (notification: LoggedUser_me_user_notifications) => void;
};

const NotificationsNotifications: FC<DialogPageProps> = (props: DialogPageProps) => {
    const [dismissing, setDismissing] = useState(false);
    const [mutationId, setMutationId] = useState('');

    return QueryLoaderAndError<LoggedUser>(
        false,
        useQuery(LoggedUserQuery, { notifyOnNetworkStatusChange: true }),
        (data: LoggedUser, valuesRefresh: (mustResetCache: boolean) => void) => {
            const dismissNotificationAction = (notification: LoggedUser_me_user_notifications) => {
                setMutationId(notification.id);
                setDismissing(true);
            };

            if (dismissing) {
                return (
                    <InDialogMutation
                        executeMutationCallback={async (
                            mutationFunction: DialogMutationFunction,
                            id: string,
                        ) => {
                            await mutationFunction({
                                variables: {
                                    dismissNotificationInput: {
                                        notification_id: id,
                                    },
                                },
                            });
                        }}
                        mutation={DismissUserNotificationQuery}
                        id={mutationId}
                        onMutationComplete={() => {
                            valuesRefresh(true);
                            setDismissing(false);
                        }}
                    />
                );
            }

            return (
                <NotificationsList
                    dismissNotificationAction={dismissNotificationAction}
                    notifications={data.me.user_notifications}
                    {...props}
                />
            );
        },
    );
};

export { NotificationsNotifications };
