import { FC } from 'react';
import { FormProps, FormValidationResult } from '../../hooks/form/useFormValidation';
import { useMutation } from '@apollo/client';
import UpdateMeQuery from '../../gql/mutations/UpdateMeQuery';
import { UpdateUser } from '../../gql/generated/UpdateUser';
import { ApolloError } from '@apollo/client/errors';
import { DialogPageProps } from '../../types/DialogTypes';
import ChangeEmailForm from '../../components/organisms/Forms/ChangeEmailForm';
import emailValidator from '../../utils/validators/emailValidator';
import confirmEmailValidator from '../../utils/validators/confirmEmailValidator';
import { DialogForm, DialogFormProps } from '../abstractions/DialogForm';

export type ChangeEmailValues = {
    email: string;
    confirmEmail: string;
};

export type ChangeEmailProps = FormProps<ChangeEmailValues> & {
    handleDialogClose: (checkChanges: boolean) => void;
};

const ChangeEmail: FC<DialogPageProps> = (props: DialogPageProps) => {
    const changeEmailProps: DialogFormProps<ChangeEmailValues, ChangeEmailProps, UpdateUser> = {
        buildInitialState: () => ({
            email: '',
            confirmEmail: '',
        }),
        saveQuery: useMutation<UpdateUser>(UpdateMeQuery),
        mapSaveData: (formValues: ChangeEmailValues) => ({
            meUpdateInput: {
                email: formValues.email,
            },
        }),
        buildFormProps: (
            formValidationValues: FormValidationResult<ChangeEmailValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Change Email',
            title: 'Change Email',
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateMe,
        pageComponent: ChangeEmailForm,
        validators: [
            {
                field: 'email',
                validator: emailValidator,
                error: () => 'Invalid email address',
            },
            {
                field: 'confirmEmail',
                validator: confirmEmailValidator,
                error: () => "Emails don't Match",
            },
        ],
        ...props,
    };

    return <DialogForm<ChangeEmailValues, ChangeEmailProps, UpdateUser> {...changeEmailProps} />;
};

export { ChangeEmail };
