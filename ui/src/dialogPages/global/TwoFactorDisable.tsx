import { FC } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LoggedUser } from '../../gql/generated/LoggedUser';
import LoggedUserQuery from '../../gql/queries/LoggedUserQuery';
import { FormProps, FormValidationResult } from '../../hooks/form/useFormValidation';
import DisableTwoFactorQuery from '../../gql/mutations/DisableTwoFactorQuery';
import TwoFactorDisableForm from '../../components/organisms/Forms/TwoFactorDisableForm';
import code2faValidator from '../../utils/validators/code2faValidator';
import { ApolloError } from '@apollo/client/errors';
import { DisableTwoFactorResult } from '../../gql/generated/DisableTwoFactorResult';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';

export type TwoFactorDisableValues = {
    code: string;
};

export type TwoFactorDisableFormProps = FormProps<TwoFactorDisableValues> & {
    handleDialogClose: (checkChanges: boolean) => void;
};

const TwoFactorDisable: FC<DialogPageProps> = (props: DialogPageProps) => {
    const twoFactorDisableProps: DialogPreloadFormProps<
        LoggedUser,
        TwoFactorDisableValues,
        TwoFactorDisableFormProps,
        DisableTwoFactorResult
    > = {
        loadQuery: useQuery<LoggedUser>(LoggedUserQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: () => ({
            code: '',
        }),
        saveQuery: useMutation<DisableTwoFactorResult>(DisableTwoFactorQuery),
        mapSaveData: (formValues: TwoFactorDisableValues) => ({
            twoFactorAuthDisableInput: {
                code: formValues.code.toString(),
            },
        }),
        buildFormProps: (
            formLoadedData: LoggedUser,
            formValidationValues: FormValidationResult<TwoFactorDisableValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Disable 2fa',
            title: 'Disable 2fa',
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.disableTwoFactorAuth,
        pageComponent: TwoFactorDisableForm,
        validators: [
            {
                field: 'code',
                validator: code2faValidator,
                error: () => 'Invalid Code',
            },
        ],
        ...props,
    };

    return (
        <DialogPreloadForm<
            LoggedUser,
            TwoFactorDisableValues,
            TwoFactorDisableFormProps,
            DisableTwoFactorResult
        >
            {...twoFactorDisableProps}
        />
    );
};

export { TwoFactorDisable };
