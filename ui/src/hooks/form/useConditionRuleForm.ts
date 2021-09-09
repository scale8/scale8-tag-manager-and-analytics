import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
    ConditionMode,
    ConditionRuleCreateInput,
    ConditionRuleUpdateInput,
    ConditionType,
    InputType,
} from '../../gql/generated/globalTypes';
import {
    FormErrors,
    FormProps,
    FormValidationResult,
    removeCurrentFieldErrors,
    SelectValueWithSub,
} from './useFormValidation';
import { DataContainer, PlatformDataMap } from '../../types/DataMapsTypes';
import { platformDataMapHasChildren } from '../../utils/PlatformDataMapsUtils';

export type ConditionRuleValues = {
    name: string;
    dataContainerId: string;
    comments: string;
    match: string;
    matchId: string;
    matchKey: string;
    matchCondition: ConditionType | any;
    dataMapValue: S8DataMapValue;
};

export type ConditionRuleFormProps = FormProps<ConditionRuleValues> & {
    dataContainers: SelectValueWithSub[];
    currentDataContainer?: DataContainer;
    currentDataElement?: PlatformDataMap;
    initialPlatformId?: string;
    generateName?: boolean;
    update?: boolean;
    consentPurposes: { id: number; name: string }[];
    consentVendors: { id: number; name: string }[];
};

const validateConditionRule = (
    values: ConditionRuleValues,
    conditionValueInputType: InputType | undefined,
    ignoreEmpty: boolean,
): FormErrors<ConditionRuleValues> => {
    const errors = {} as FormErrors<ConditionRuleValues>;
    // Name Errors
    if (ignoreEmpty && values.name.length === 0) {
        // Don' trigger the error
    } else if (values.name.length < 2) {
        errors.name = 'ConditionRule Group name too short';
    }

    // Custom Data Element Errors
    if (ignoreEmpty && values.match.length === 0) {
        // Don' trigger the error
    } else if (values.match.match(/^[a-zA-Z0-9_.]*$/) === null) {
        errors.match = 'Invalid data element';
    }

    // Value Errors
    if (ignoreEmpty && values.dataMapValue.toString().length === 0) {
        // Don' trigger the error
    } else if (conditionValueInputType !== undefined) {
        if (conditionValueInputType === InputType.INT_INPUT && isNaN(+values.dataMapValue)) {
            errors.dataMapValue = 'Value must be a number';
        }
    }

    return errors;
};

const findDataElementById = (
    platformDataMaps: PlatformDataMap[],
    id: string,
): PlatformDataMap | undefined => {
    let result = undefined;
    platformDataMaps.forEach((platformDataMap) => {
        if (platformDataMapHasChildren(platformDataMap)) {
            const childrenResult = findDataElementById(
                (platformDataMap as any).child_platform_data_maps,
                id,
            );
            if (childrenResult !== undefined) {
                result = childrenResult;
            }
        }
        if (platformDataMap.id === id) {
            result = platformDataMap;
        }
    });
    return result;
};

const buildConditionRuleCreateInput = (
    triggerId: string,
    conditionMode: ConditionMode,
    conditionRuleValues: ConditionRuleValues,
): ConditionRuleCreateInput => {
    return {
        trigger_id: triggerId,
        condition_mode: conditionMode,
        platform_data_container_id: conditionRuleValues.dataContainerId,
        name: conditionRuleValues.name,
        match: conditionRuleValues.match === '' ? undefined : conditionRuleValues.match,
        match_id: conditionRuleValues.matchId === '' ? undefined : conditionRuleValues.matchId,
        match_key: conditionRuleValues.matchKey === '' ? undefined : conditionRuleValues.matchKey,
        match_condition: conditionRuleValues.matchCondition,
        match_value: conditionRuleValues.dataMapValue,
        ...(conditionRuleValues.comments === ''
            ? {}
            : {
                  comments: conditionRuleValues.comments,
              }),
    };
};

const buildConditionRuleUpdateInput = (
    conditionId: string,
    conditionRuleValues: ConditionRuleValues,
): ConditionRuleUpdateInput => {
    return {
        condition_rule_id: conditionId,
        name: conditionRuleValues.name,
        match: conditionRuleValues.match === '' ? undefined : conditionRuleValues.match,
        match_id: conditionRuleValues.matchId === '' ? undefined : conditionRuleValues.matchId,
        match_key: conditionRuleValues.matchKey === '' ? undefined : conditionRuleValues.matchKey,
        match_condition: conditionRuleValues.matchCondition,
        match_value: conditionRuleValues.dataMapValue,
        ...(conditionRuleValues.comments === ''
            ? {}
            : {
                  comments: conditionRuleValues.comments,
              }),
    };
};

const useConditionRuleForm = (
    initialState: ConditionRuleValues,
    submit: (values: ConditionRuleValues) => Promise<void>,
    availableDataContainers: DataContainer[],
): FormValidationResult<ConditionRuleValues> & {
    currentDataContainer?: DataContainer;
    currentDataElement?: PlatformDataMap;
} => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({} as FormErrors<ConditionRuleValues>);
    const [isSubmitting, setSubmitting] = useState(false);

    const submitCallback = useCallback(submit, []);

    const currentDataContainer = availableDataContainers.find(
        (dataContainer) => dataContainer.id === values.dataContainerId,
    );

    const currentDataElement: PlatformDataMap | undefined =
        currentDataContainer && values.matchId !== ''
            ? findDataElementById(currentDataContainer.platform_data_maps, values.matchId)
            : undefined;

    useEffect(() => {
        (async () => {
            if (isSubmitting) {
                const noErrors = Object.keys(errors).length === 0;
                if (noErrors) {
                    await submitCallback(values);
                    setSubmitting(false);
                } else {
                    setSubmitting(false);
                }
            }
        })();
    }, [errors, values, isSubmitting, setSubmitting, submitCallback]);

    const handleChange = (valueKey: string, value: any) => {
        if (valueKey === 'dataContainerId') {
            // reset all values depending on dataContainer
            setValues({
                ...values,
                matchId: '',
                match: '',
                matchCondition: '',
                dataMapValue: '',
                [valueKey]: value,
            });
            // Remove all errors on values depending on dataContainer (all but name)
            setErrors(
                Object.keys(errors).reduce((newErrors, key) => {
                    if (key === 'name') {
                        newErrors[key as keyof ConditionRuleValues] = errors[key];
                    }
                    return newErrors;
                }, {} as FormErrors<ConditionRuleValues>),
            );
        } else if (valueKey === 'matchId') {
            // reset all values depending on matchId
            const resultingDataElement = currentDataContainer
                ? findDataElementById(currentDataContainer.platform_data_maps, value)
                : undefined;
            setValues({
                ...values,
                matchCondition: '',
                dataMapValue:
                    resultingDataElement?.input_type === InputType.CHECKBOX ||
                    resultingDataElement?.input_type === InputType.BOOLEAN_INPUT
                        ? true
                        : '',
                [valueKey]: value,
            });
            // Remove all errors on values depending on matchId (dataMapValue)
            setErrors(
                Object.keys(errors).reduce((newErrors, key) => {
                    if (key !== 'dataMapValue') {
                        newErrors[key as keyof ConditionRuleValues] =
                            errors[key as keyof ConditionRuleValues];
                    }
                    return newErrors;
                }, {} as FormErrors<ConditionRuleValues>),
            );
        } else {
            setValues({
                ...values,
                [valueKey]: value,
            });
            if (errors[valueKey as keyof ConditionRuleValues]) {
                removeCurrentFieldErrors<ConditionRuleValues>(setErrors, errors, valueKey);
            }
        }
    };

    const handleBlur = () => {
        setErrors(validateConditionRule(values, currentDataElement?.input_type, true));
    };

    const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault();
        }
        const validationErrors = validateConditionRule(
            values,
            currentDataElement?.input_type,
            false,
        );
        setErrors(validationErrors);
        setSubmitting(true);
    };

    return {
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        setValues,
        errors,
        isSubmitting,
        currentDataContainer,
        currentDataElement,
    };
};

export {
    useConditionRuleForm,
    buildConditionRuleCreateInput,
    buildConditionRuleUpdateInput,
    findDataElementById,
};
