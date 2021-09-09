import { FC } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { FormProps, FormValidationResult } from '../../hooks/form/useFormValidation';
import EnableTwoFactorQuery from '../../gql/mutations/EnableTwoFactorQuery';
import TwoFactorEnableForm from '../../components/organisms/Forms/TwoFactorEnableForm';
import { PrepareTwoFactor } from '../../gql/generated/PrepareTwoFactor';
import PrepareTwoFactorQuery from '../../gql/queries/PrepareTwoFactorQuery';
import code2faValidator from '../../utils/validators/code2faValidator';
import { ApolloError } from '@apollo/client/errors';
import { EnableTwoFactorResult } from '../../gql/generated/EnableTwoFactorResult';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';

export type TwoFactorEnableValues = {
    code: string;
};

export type TwoFactorEnableFormProps = FormProps<TwoFactorEnableValues> & {
    handleDialogClose: (checkChanges: boolean) => void;
    secret: string;
    email: string;
};

const TwoFactorEnable: FC<DialogPageProps> = (props: DialogPageProps) => {
    const twoFactorEnableProps: DialogPreloadFormProps<
        PrepareTwoFactor,
        TwoFactorEnableValues,
        TwoFactorEnableFormProps,
        EnableTwoFactorResult
    > = {
        loadQuery: useQuery<PrepareTwoFactor>(PrepareTwoFactorQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: () => ({
            code: '',
        }),
        saveQuery: useMutation<EnableTwoFactorResult>(EnableTwoFactorQuery),
        mapSaveData: (formValues: TwoFactorEnableValues) => ({
            twoFactorAuthEnableInput: {
                code: formValues.code.toString(),
            },
        }),
        buildFormProps: (
            formLoadedData: PrepareTwoFactor,
            formValidationValues: FormValidationResult<TwoFactorEnableValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Enable 2fa',
            title: 'Enable 2fa',
            secret: formLoadedData.prepareTwoFactor,
            email: formLoadedData.me.email,
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.enableTwoFactorAuth,
        pageComponent: TwoFactorEnableForm,
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
            PrepareTwoFactor,
            TwoFactorEnableValues,
            TwoFactorEnableFormProps,
            EnableTwoFactorResult
        >
            {...twoFactorEnableProps}
        />
    );
};

export { TwoFactorEnable };
