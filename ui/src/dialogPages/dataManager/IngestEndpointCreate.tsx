import { Dispatch, FC, SetStateAction } from 'react';
import IngestEndpointForm from '../../components/organisms/Forms/IngestEndpointForm';
import { FormProps, FormValidationResult } from '../../hooks/form/useFormValidation';
import CreateIngestEndpointQuery from '../../gql/mutations/CreateIngestEndpointQuery';
import { ApolloError, useMutation } from '@apollo/client';
import { CreateIngestEndpointResult } from '../../gql/generated/CreateIngestEndpointResult';
import { DialogPageProps } from '../../types/DialogTypes';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import {
    IngestEndpointValidators,
    IngestEndpointValues,
} from '../../utils/forms/IngestEndpointFormUtils';
import { DialogForm, DialogFormProps } from '../abstractions/DialogForm';
import {
    buildStorageProviderSaveProperties,
    initialStorageProviderFields,
    storageProviderCustomValueSetter,
} from '../../utils/StorageProviderUtils';
import { Mode, StorageProvider } from '../../gql/generated/globalTypes';
import { useConfigState } from '../../context/AppContext';

export type IngestEndpointFormProps = FormProps<IngestEndpointValues> & {
    isCreate: boolean;
};

const IngestEndpointCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const dataManagerId = props.contextId;

    const { mode } = useConfigState();

    const customValueSetter = (
        valueKey: string,
        value: any,
        values: IngestEndpointValues,
        setValues: Dispatch<SetStateAction<IngestEndpointValues>>,
    ) => {
        if (storageProviderCustomValueSetter(valueKey, value, values, setValues)) {
            return;
        }
        if (valueKey === 'analyticsEnabled') {
            if (!values.analyticsEnabled) {
                setValues({
                    ...values,
                    ...initialStorageProviderFields,
                    storageProvider: StorageProvider.MONGODB,
                    [valueKey]: value,
                });
            } else {
                setValues({
                    ...values,
                    [valueKey]: value,
                });
            }
        } else {
            setValues({
                ...values,
                [valueKey]: value,
            });
        }
    };

    const ingestEndpointCreateProps: DialogFormProps<
        IngestEndpointValues,
        IngestEndpointFormProps,
        CreateIngestEndpointResult
    > = {
        buildInitialState: () => ({
            ...initialStorageProviderFields,
            name: '',
            analyticsEnabled: false,
            storageProvider: StorageProvider.MONGODB,
        }),
        saveQuery: useMutation<CreateIngestEndpointResult>(CreateIngestEndpointQuery),
        mapSaveData: (formValues: IngestEndpointValues) => {
            if (mode === Mode.COMMERCIAL) {
                return {
                    ingestEndpointCreateInput: {
                        data_manager_account_id: dataManagerId,
                        name: formValues.name,
                        analytics_enabled: true,
                    },
                };
            }

            return {
                ingestEndpointCreateInput: {
                    data_manager_account_id: dataManagerId,
                    name: formValues.name,
                    analytics_enabled: formValues.analyticsEnabled,
                    storage_provider: formValues.storageProvider as StorageProvider,
                    ...buildStorageProviderSaveProperties(formValues, true),
                },
            };
        },
        buildFormProps: (
            formValidationValues: FormValidationResult<IngestEndpointValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Ingest Endpoint',
            title: 'Create Ingest Endpoint',
            formInfoProps: buildStandardFormInfo('ingestEndpoints', 'Create'),
            handleDialogClose: props.handleDialogClose,
            isCreate: true,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.createIngestEndpoint.id !== undefined,
        pageComponent: IngestEndpointForm,
        validators: IngestEndpointValidators,
        customValueSetter,
        ...props,
    };

    return (
        <DialogForm<IngestEndpointValues, IngestEndpointFormProps, CreateIngestEndpointResult>
            {...ingestEndpointCreateProps}
        />
    );
};

export default IngestEndpointCreate;
