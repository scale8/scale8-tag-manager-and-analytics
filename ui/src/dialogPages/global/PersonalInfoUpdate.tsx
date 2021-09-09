import { FC } from 'react';
import { FormProps, FormValidationResult } from '../../hooks/form/useFormValidation';
import { useMutation, useQuery } from '@apollo/client';
import LoggedUserQuery from '../../gql/queries/LoggedUserQuery';
import { LoggedUser } from '../../gql/generated/LoggedUser';
import PersonalInfoForm from '../../components/organisms/Forms/PersonalInfoForm';
import UpdateMeQuery from '../../gql/mutations/UpdateMeQuery';
import nameValidator from '../../utils/validators/nameValidator';
import { UpdateUser } from '../../gql/generated/UpdateUser';
import { ApolloError } from '@apollo/client/errors';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';

export type PersonalInfoValues = {
    firstName: string;
    lastName: string;
};

export type PersonalInfoFormProps = FormProps<PersonalInfoValues> & {
    handleDialogClose: (checkChanges: boolean) => void;
};

const PersonalInfoUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const personalInfoUpdateProps: DialogPreloadFormProps<
        LoggedUser,
        PersonalInfoValues,
        PersonalInfoFormProps,
        UpdateUser
    > = {
        loadQuery: useQuery<LoggedUser>(LoggedUserQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: LoggedUser) => ({
            firstName: formLoadedData.me.first_name,
            lastName: formLoadedData.me.last_name,
        }),
        saveQuery: useMutation<UpdateUser>(UpdateMeQuery),
        mapSaveData: (formValues: PersonalInfoValues) => ({
            meUpdateInput: {
                first_name: formValues.firstName,
                last_name: formValues.lastName,
            },
        }),
        buildFormProps: (
            formLoadedData: LoggedUser,
            formValidationValues: FormValidationResult<PersonalInfoValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Update Personal Info',
            title: 'Update Personal Info',
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateMe,
        pageComponent: PersonalInfoForm,
        validators: [
            {
                field: 'firstName',
                validator: nameValidator,
                error: () => 'First name too short',
            },
            {
                field: 'lastName',
                validator: nameValidator,
                error: () => 'Last name too short',
            },
        ],
        ...props,
    };

    return (
        <DialogPreloadForm<LoggedUser, PersonalInfoValues, PersonalInfoFormProps, UpdateUser>
            {...personalInfoUpdateProps}
        />
    );
};

export { PersonalInfoUpdate };
