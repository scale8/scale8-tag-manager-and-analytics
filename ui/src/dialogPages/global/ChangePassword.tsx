import { FC } from 'react';
import { FormProps, FormValidationResult } from '../../hooks/form/useFormValidation';
import { useMutation, useQuery } from '@apollo/client';
import ChangePasswordForm from '../../components/organisms/Forms/ChangePasswordForm';
import ChangePasswordQuery from '../../gql/mutations/ChangePasswordQuery';
import { LoggedUser } from '../../gql/generated/LoggedUser';
import LoggedUserQuery from '../../gql/queries/LoggedUserQuery';
import newPasswordValidator from '../../utils/validators/newPasswordValidator';
import confirmPasswordValidator from '../../utils/validators/confirmPasswordValidator';
import { ApolloError } from '@apollo/client/errors';
import { ChangePasswordResult } from '../../gql/generated/ChangePasswordResult';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';

export type ChangePasswordValues = {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
};

export type ChangePasswordFormProps = FormProps<ChangePasswordValues> & {
    handleDialogClose: (checkChanges: boolean) => void;
    hasLinkedSSO: boolean;
    email: string;
};

const ChangePassword: FC<DialogPageProps> = (props: DialogPageProps) => {
    const changePasswordsProps: DialogPreloadFormProps<
        LoggedUser,
        ChangePasswordValues,
        ChangePasswordFormProps,
        ChangePasswordResult
    > = {
        loadQuery: useQuery<LoggedUser>(LoggedUserQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: () => ({
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
        }),
        saveQuery: useMutation(ChangePasswordQuery),
        mapSaveData: (formValues: ChangePasswordValues) => ({
            changePasswordInput: {
                old_password: formValues.oldPassword,
                new_password: formValues.newPassword,
            },
        }),
        buildFormProps: (
            formLoadedData: LoggedUser,
            formValidationValues: FormValidationResult<ChangePasswordValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Change Password',
            title: 'Change Password',
            hasLinkedSSO: formLoadedData.me.github_connected,
            email: formLoadedData.me.email,
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.changePassword,
        pageComponent: ChangePasswordForm,
        validators: [
            {
                field: 'newPassword',
                validator: newPasswordValidator,
                error: () => 'New Password too short',
            },
            {
                field: 'newPasswordConfirm',
                validator: confirmPasswordValidator,
                error: () => "Passwords don't Match",
            },
        ],
        noRefresh: true,
        ...props,
    };

    return (
        <DialogPreloadForm<
            LoggedUser,
            ChangePasswordValues,
            ChangePasswordFormProps,
            ChangePasswordResult
        >
            {...changePasswordsProps}
        />
    );
};

export { ChangePassword };
