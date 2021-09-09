import { FC } from 'react';
import { FormProps, FormValidationResult } from '../../hooks/form/useFormValidation';
import { useMutation, useQuery } from '@apollo/client';
import LoggedUserQuery from '../../gql/queries/LoggedUserQuery';
import { LoggedUser } from '../../gql/generated/LoggedUser';
import UpdateMeQuery from '../../gql/mutations/UpdateMeQuery';
import NotificationSettingsForm from '../../components/organisms/Forms/NotificationSettingsForm';
import { ApolloError } from '@apollo/client/errors';
import { UpdateUser } from '../../gql/generated/UpdateUser';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';

export type NotificationsSettingsValues = {
    emailNotifications: boolean;
};

export type NotificationsSettingsFormProps = FormProps<NotificationsSettingsValues> & {
    handleDialogClose: (checkChanges: boolean) => void;
};

const NotificationsSettings: FC<DialogPageProps> = (props: DialogPageProps) => {
    const notificationSettingsProps: DialogPreloadFormProps<
        LoggedUser,
        NotificationsSettingsValues,
        NotificationsSettingsFormProps,
        UpdateUser
    > = {
        loadQuery: useQuery<LoggedUser>(LoggedUserQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: LoggedUser) => ({
            emailNotifications: formLoadedData.me.email_notifications,
        }),
        saveQuery: useMutation<UpdateUser>(UpdateMeQuery),
        mapSaveData: (formValues: NotificationsSettingsValues) => ({
            meUpdateInput: {
                email_notifications: formValues.emailNotifications,
            },
        }),
        buildFormProps: (
            formLoadedData: LoggedUser,
            formValidationValues: FormValidationResult<NotificationsSettingsValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Update Notification Settings',
            title: 'Update Notification Settings',
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateMe,
        pageComponent: NotificationSettingsForm,
        validators: [],
        ...props,
    };

    return (
        <DialogPreloadForm<
            LoggedUser,
            NotificationsSettingsValues,
            NotificationsSettingsFormProps,
            UpdateUser
        >
            {...notificationSettingsProps}
        />
    );
};

export { NotificationsSettings };
