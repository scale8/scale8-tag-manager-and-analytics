import { Dispatch, FC, SetStateAction } from 'react';
import { FormProps, useFormValidation } from '../../hooks/form/useFormValidation';
import IngestEndpointDataMapForm from '../../components/organisms/Forms/IngestEndpointDataMapForm';
import {
    AddChildrenIngestEndpointDataMapsInput,
    IngestEndpointAddIngestEndpointDataMapsInput,
    VarType,
} from '../../gql/generated/globalTypes';
import { useMutation } from '@apollo/client';
import CreateIngestEndpointDataMapChildQuery from '../../gql/mutations/CreateIngestEndpointDataMapChildQuery';
import CreateIngestEndpointDataMapQuery from '../../gql/mutations/CreateIngestEndpointDataMapQuery';
import keyValidator from '../../utils/validators/keyValidator';
import { isVarTypeArray } from '../../utils/VarTypeUtils';
import { DialogPageProps } from '../../types/DialogTypes';
import { usePageDialogControls } from '../../hooks/dialog/usePageDialogControls';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import { PlatformDataMapValidation } from '../../types/DataMapsTypes';
import { logError } from '../../utils/logUtils';

export type IngestEndpointDataMapValues = {
    id?: string;
    key: string;
    varType: string;
    defaultValue: S8DataMapValue;
    defaultValues: S8DataMapValue[];
    optional: boolean;
    useDefault: boolean;
    validationRules: PlatformDataMapValidation[] | undefined;
};

export type IngestEndpointDataMapFormProps = FormProps<IngestEndpointDataMapValues> & {
    lastLevel: boolean;
    edit: boolean;
    readOnly: boolean;
};

export const IngestEndpointDataMapCreateWithLevel: FC<DialogPageProps & { lastLevel: boolean }> = (
    props: DialogPageProps & { lastLevel: boolean },
) => {
    const { id: parentId, contextId: ingest_endpoint_revision_id, name: parentName } = props;

    const isRoot = parentId === undefined || parentId === '';

    const [
        addIngestEndpointDataMaps,
        { loading: rootLoading, data: rootData, error: rootGqlError },
    ] = useMutation(CreateIngestEndpointDataMapQuery);

    const [
        addChildrenIngestEndpointDataMaps,
        { loading: childLoading, data: childData, error: childGqlError },
    ] = useMutation(CreateIngestEndpointDataMapChildQuery);

    const loading = isRoot ? rootLoading : childLoading;
    const data = isRoot ? rootData : childData;
    const gqlError = isRoot ? rootGqlError : childGqlError;

    const formInitialState: IngestEndpointDataMapValues = {
        key: '',
        varType: '',
        defaultValue: '',
        defaultValues: [],
        optional: true,
        useDefault: false,
        validationRules: undefined,
    };

    const submitForm = async (ingestEndpointDataMapValues: IngestEndpointDataMapValues) => {
        const varType = ingestEndpointDataMapValues.varType as VarType;
        const useArrayDefault = isVarTypeArray(varType);
        const ingest_endpoint_data_maps = [
            {
                key: ingestEndpointDataMapValues.key,
                var_type: varType,
                default_value:
                    ingestEndpointDataMapValues.useDefault && !useArrayDefault
                        ? ingestEndpointDataMapValues.defaultValue
                        : undefined,
                default_values:
                    ingestEndpointDataMapValues.useDefault && useArrayDefault
                        ? ingestEndpointDataMapValues.defaultValues
                        : undefined,
                optional: ingestEndpointDataMapValues.useDefault
                    ? false
                    : ingestEndpointDataMapValues.optional,
                validation_rules:
                    ingestEndpointDataMapValues.validationRules === undefined
                        ? undefined
                        : ingestEndpointDataMapValues.validationRules,
            },
        ];

        if (isRoot) {
            const ingestEndpointAddIngestEndpointDataMapsInput: IngestEndpointAddIngestEndpointDataMapsInput =
                {
                    ingest_endpoint_revision_id,
                    ingest_endpoint_data_maps,
                };
            try {
                await addIngestEndpointDataMaps({
                    variables: { ingestEndpointAddIngestEndpointDataMapsInput },
                });
            } catch (error) {
                logError(error);
            }
        } else {
            const addChildrenIngestEndpointDataMapsInput: AddChildrenIngestEndpointDataMapsInput = {
                ingest_endpoint_data_map_id: parentId,
                ingest_endpoint_data_maps,
            };
            try {
                await addChildrenIngestEndpointDataMaps({
                    variables: { addChildrenIngestEndpointDataMapsInput },
                });
            } catch (error) {
                logError(error);
            }
        }
    };

    const customValueSetter = (
        valueKey: string,
        value: any,
        values: IngestEndpointDataMapValues,
        setValues: Dispatch<SetStateAction<IngestEndpointDataMapValues>>,
    ) => {
        if (valueKey === 'varType') {
            setValues({
                ...values,
                [valueKey]: value,
                optional: true,
                useDefault: false,
                defaultValue: value === VarType.BOOLEAN ? false : '', // boolean select will default to '' otherwise
                defaultValues: [],
                validationRules: undefined,
            });
        } else {
            setValues({
                ...values,
                [valueKey]: value,
            });
        }
    };

    const formValidationValues = useFormValidation<IngestEndpointDataMapValues>(
        formInitialState,
        [
            {
                field: 'key',
                validator: keyValidator,
                error: () => 'Invalid key',
            },
        ],
        submitForm,
        false,
        customValueSetter,
    );

    const successfullySubmitted = isRoot
        ? data?.addIngestEndpointDataMaps[0].id !== undefined
        : data?.addChildrenIngestEndpointDataMaps[0].id !== undefined;

    usePageDialogControls(
        JSON.stringify(formInitialState) === JSON.stringify(formValidationValues.values),
        successfullySubmitted,
        props.setPageHasChanges,
        props.handleDialogClose,
        props.pageRefresh,
    );

    if (loading || successfullySubmitted) {
        return <div />;
    }

    const formProps: IngestEndpointDataMapFormProps = {
        ...formValidationValues,
        gqlError,
        submitText: 'Create Data Map',
        title: parentName ? `Add child data map to ${parentName}` : 'Create Data Map',
        lastLevel: props.lastLevel,
        formInfoProps: buildStandardFormInfo('ingestEndpointDataMaps', 'Add'),
        handleDialogClose: props.handleDialogClose,
        edit: false,
        readOnly: false,
    };

    return <IngestEndpointDataMapForm {...formProps} />;
};

const IngestEndpointDataMapCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <IngestEndpointDataMapCreateWithLevel lastLevel={false} {...props} />;
};

export default IngestEndpointDataMapCreate;
