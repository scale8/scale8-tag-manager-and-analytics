import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import {
    IngestEndpointDataMapFormProps,
    IngestEndpointDataMapValues,
} from './IngestEndpointDataMapCreate';
import { queryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import { useMutation, useQuery } from '@apollo/client';
import UpdateIngestEndpointDataMapGetQuery from '../../gql/queries/UpdateIngestEndpointDataMapGetQuery';
import {
    UpdateIngestEndpointDataMapGetData,
    UpdateIngestEndpointDataMapGetData_getIngestEndpointDataMap,
} from '../../gql/generated/UpdateIngestEndpointDataMapGetData';
import {
    DataMapDefaultValueContainer,
    DataMapDefaultValueContainerArray,
} from '../../types/DataMapsTypes';
import { usePageDialogControls } from '../../hooks/dialog/usePageDialogControls';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import IngestEndpointDataMapForm from '../../components/organisms/Forms/IngestEndpointDataMapForm';
import { useFormValidation } from '../../hooks/form/useFormValidation';
import UpdateIngestEndpointDataMapQuery from '../../gql/mutations/UpdateIngestEndpointDataMapQuery';
import { isVarTypeArray } from '../../utils/VarTypeUtils';
import { IngestEndpointDataMapUpdateInput, VarType } from '../../gql/generated/globalTypes';
import { UpdateIngestEndpointDataMap } from '../../gql/generated/UpdateIngestEndpointDataMap';
import { logError } from '../../utils/logUtils';

const IngestEndpointDataMapUpdateAfterLoad: FC<
    DialogPageProps & {
        initialState: IngestEndpointDataMapValues;
    }
> = (
    props: DialogPageProps & {
        initialState: IngestEndpointDataMapValues;
    },
) => {
    const [updateIngestEndpointDataMap, { loading, data, error: gqlError }] =
        useMutation<UpdateIngestEndpointDataMap>(UpdateIngestEndpointDataMapQuery);

    const submitForm = async (ingestEndpointDataMapValues: IngestEndpointDataMapValues) => {
        if (props.readOnly) {
            return;
        }
        const varType = ingestEndpointDataMapValues.varType as VarType;
        const useArrayDefault = isVarTypeArray(varType);
        const ingestEndpointDataMapUpdateInput: IngestEndpointDataMapUpdateInput = {
            ingest_endpoint_data_map_id: ingestEndpointDataMapValues.id ?? '',
            remove_default_value: !ingestEndpointDataMapValues.useDefault,
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
        };
        try {
            await updateIngestEndpointDataMap({
                variables: { ingestEndpointDataMapUpdateInput },
            });
        } catch (error) {
            logError(error);
        }
    };

    const formValidationValues = useFormValidation<IngestEndpointDataMapValues>(
        props.initialState,
        [],
        submitForm,
    );

    const successfullySubmitted = !!data?.updateIngestEndpointDataMap;

    usePageDialogControls(
        JSON.stringify(props.initialState) === JSON.stringify(formValidationValues.values),
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
        submitText: 'Update Data Map',
        title: 'Update Data Map',
        lastLevel: false,
        formInfoProps: buildStandardFormInfo('ingestEndpointDataMaps', 'Update'),
        handleDialogClose: props.handleDialogClose,
        edit: true,
        readOnly: props.readOnly,
    };

    return <IngestEndpointDataMapForm {...formProps} />;
};

const IngestEndpointDataMapInspectOrEdit: FC<DialogPageProps> = (props: DialogPageProps) => {
    return queryLoaderAndError<UpdateIngestEndpointDataMapGetData>(
        false,
        useQuery<UpdateIngestEndpointDataMapGetData>(UpdateIngestEndpointDataMapGetQuery, {
            variables: { id: props.id },
        }),
        (data: UpdateIngestEndpointDataMapGetData) => {
            const extractDataMapDefaultValue = (
                dataMap: UpdateIngestEndpointDataMapGetData_getIngestEndpointDataMap,
            ): S8DataMapValue | null => {
                return dataMap.default_value !== null &&
                    dataMap.default_value.hasOwnProperty('value') &&
                    (dataMap.default_value as DataMapDefaultValueContainer).value !== null
                    ? (dataMap.default_value as DataMapDefaultValueContainer).value
                    : null;
            };

            const extractDataMapDefaultValues = (
                dataMap: UpdateIngestEndpointDataMapGetData_getIngestEndpointDataMap,
            ): S8DataMapValue[] | null => {
                return dataMap.default_value !== null &&
                    dataMap.default_value.hasOwnProperty('values') &&
                    (dataMap.default_value as DataMapDefaultValueContainerArray).values !== null
                    ? (dataMap.default_value as DataMapDefaultValueContainerArray).values
                    : null;
            };

            const defaultValue = extractDataMapDefaultValue(data.getIngestEndpointDataMap);
            const defaultValues = extractDataMapDefaultValues(data.getIngestEndpointDataMap);

            const initialState = {
                id: data.getIngestEndpointDataMap.id,
                key: data.getIngestEndpointDataMap.key,
                varType: data.getIngestEndpointDataMap.var_type,
                defaultValue: defaultValue ?? '',
                defaultValues: defaultValues ?? [],
                useDefault: defaultValue !== null || defaultValues !== null,
                optional: data.getIngestEndpointDataMap.is_optional,
                validationRules:
                    data.getIngestEndpointDataMap.validation_rules === null
                        ? undefined
                        : data.getIngestEndpointDataMap.validation_rules.map((_) => ({
                              input_value: _.input_value,
                              type: _.type,
                          })),
            };

            return <IngestEndpointDataMapUpdateAfterLoad initialState={initialState} {...props} />;
        },
    );
};

const IngestEndpointDataMapUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <IngestEndpointDataMapInspectOrEdit {...props} readOnly={false} />;
};

const IngestEndpointDataMapInspect: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <IngestEndpointDataMapInspectOrEdit {...props} readOnly={true} />;
};

export { IngestEndpointDataMapUpdate, IngestEndpointDataMapInspect };
