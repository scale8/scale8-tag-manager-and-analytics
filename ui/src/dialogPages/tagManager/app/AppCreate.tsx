import { FC } from 'react';
import AppForm from '../../../components/organisms/Forms/AppForm';
import { FormProps, FormValidationResult } from '../../../hooks/form/useFormValidation';
import { ApolloError, useMutation } from '@apollo/client';
import CreateAppQuery from '../../../gql/mutations/CreateAppQuery';
import { AppType, StorageProvider } from '../../../gql/generated/globalTypes';
import domainValidator from '../../../utils/validators/domainValidator';
import nameValidator from '../../../utils/validators/nameValidator';
import { CreateApp } from '../../../gql/generated/CreateApp';
import { DialogPageProps } from '../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';
import { DialogForm, DialogFormProps } from '../../abstractions/DialogForm';
import { StorageProviderFields } from '../../../utils/StorageProviderUtils';

export type AppValues = StorageProviderFields & {
    name: string;
    domain: string;
    type: AppType;
    analyticsEnabled: boolean;
    errorTrackingEnabled: boolean;
};

export type AppFormProps = FormProps<AppValues> & {
    useDomainName?: boolean;
    isCreate: boolean;
};

const AppCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const accountId = props.contextId;

    const appCreateProps: DialogFormProps<AppValues, AppFormProps, CreateApp> = {
        buildInitialState: () => ({
            name: '',
            domain: '',
            analyticsEnabled: true,
            errorTrackingEnabled: true,
            storageProvider: StorageProvider.MONGODB,
            type: AppType.WEB,
        }),
        saveQuery: useMutation(CreateAppQuery),
        mapSaveData: (appValues: AppValues) => ({
            appCreateInput: {
                tag_manager_account_id: accountId,
                name: appValues.name,
                domain: appValues.domain,
                type: appValues.type,
            },
        }),
        buildFormProps: (
            formValidationValues: FormValidationResult<AppValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Application',
            title: 'Create Application',
            formInfoProps: buildStandardFormInfo('applications', 'Create'),
            handleDialogClose: props.handleDialogClose,
            isCreate: true,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.createApp.id !== undefined,
        getSavedId: (formMutationData) => formMutationData?.createApp.id,
        pageComponent: AppForm,
        validators: [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Application name too short',
            },
            {
                field: 'domain',
                validator: domainValidator,
                error: () => 'Invalid domain',
            },
        ],
        ...props,
    };

    return <DialogForm<AppValues, AppFormProps, CreateApp> {...appCreateProps} />;
};

export { AppCreate };
