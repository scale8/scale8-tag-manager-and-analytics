import { TextFieldProps } from '@mui/material/TextField/TextField';
import { FormProps } from '../../hooks/form/useFormValidation';
import { ReactElement } from 'react';
import { VarType } from '../../gql/generated/globalTypes';
import ControlledTextInput from '../atoms/ControlledInputs/ControlledTextInput';
import ControlledIntegerInput from '../atoms/ControlledInputs/ControlledIntegerInput';
import ControlledFloatInput from '../atoms/ControlledInputs/ControlledFloatInput';
import ArrayInput from '../atoms/InputTypes/ArrayInput';
import ControlledBooleanSelect from '../atoms/ControlledInputs/ControlledBooleanSelect';
import { isVarTypeArray } from '../../utils/VarTypeUtils';
import ControlledCodeInput from '../atoms/ControlledInputs/ControlledCodeInput';
import ControlledColorInput from '../atoms/ControlledInputs/ControlledColorInput';
import ControlledCountrySelect from '../atoms/ControlledInputs/ControlledCountrySelect';
import ControlledDomSelectorInput from '../atoms/ControlledInputs/ControlledDomSelectorInput';
import ControlledDateStringInput from '../atoms/ControlledInputs/ControlledDateStringInput';
import ControlledDateStampInput from '../atoms/ControlledInputs/ControlledDateStampInput';
import ControlledTextAreaInput from '../atoms/ControlledInputs/ControlledTextAreaInput';

export type DataMapDefaultValueFormSectionProps<Values extends { [key: string]: any }> =
    TextFieldProps & {
        platformDataMapType?: string;
        varType?: string;
        formProps: FormProps<Values>;
        readOnly: boolean;
    };

const DataMapDefaultValueFormSection = <T extends { [key: string]: any }>(
    props: DataMapDefaultValueFormSectionProps<T>,
): ReactElement | null => {
    const { platformDataMapType, varType, formProps } = props;

    const defaultValues: S8DataMapValue[] = formProps.values.defaultValues as S8DataMapValue[];

    if (platformDataMapType === undefined) {
        //varType
        if (varType === undefined) {
            return null;
        } else if (varType === VarType.STRING) {
            return (
                <ControlledTextInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    disabled={props.readOnly}
                />
            );
        } else if (varType === VarType.INT) {
            return (
                <ControlledIntegerInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    disabled={props.readOnly}
                    required
                />
            );
        } else if (varType === VarType.FLOAT) {
            return (
                <ControlledFloatInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    disabled={props.readOnly}
                    required
                />
            );
        } else if (varType === VarType.BOOLEAN) {
            return (
                <ControlledBooleanSelect
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    disabled={props.readOnly}
                />
            );
        } else if (varType === VarType.TIMESTAMP) {
            return (
                <ControlledDateStampInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    disabled={props.readOnly}
                    includeTime
                    required
                />
            );
        } else if (varType === VarType.DATETIME) {
            return (
                <ControlledDateStringInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    disabled={props.readOnly}
                    includeTime
                    required
                />
            );
        } else if (isVarTypeArray(varType as VarType)) {
            return (
                <div>
                    <ArrayInput
                        contained
                        name="array-default-value"
                        label="Default Values"
                        values={defaultValues}
                        disabled={props.readOnly}
                        setValue={(v, index) => {
                            formProps.handleChange(
                                'defaultValues',
                                defaultValues.map((_, key) => {
                                    if (key === index) {
                                        return v;
                                    } else {
                                        return _;
                                    }
                                }),
                            );
                        }}
                        removeArrayElement={(v, index) => {
                            formProps.handleChange(
                                'defaultValues',
                                defaultValues.filter((_, key) => key !== index),
                            );
                        }}
                        addArrayElement={() => {
                            formProps.handleChange('defaultValues', [...defaultValues, '']);
                        }}
                        errors={new Map<number, string>()}
                        arrayType={
                            varType === VarType.ARRAY_INT
                                ? 'int'
                                : varType === VarType.ARRAY_FLOAT
                                ? 'float'
                                : 'text'
                        }
                    />
                </div>
            );
        } else {
            return null;
        }
    } else {
        //platformDataMapType
        if (platformDataMapType === 'Boolean' || platformDataMapType === 'Checkbox') {
            return (
                <ControlledBooleanSelect
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    disabled={props.readOnly}
                />
            );
        } else if (
            platformDataMapType === 'Text' ||
            platformDataMapType === 'Email' ||
            platformDataMapType === 'Radio' ||
            platformDataMapType === 'Select' ||
            platformDataMapType === 'Url' ||
            platformDataMapType === 'Url with Macro'
        ) {
            return (
                <ControlledTextInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    disabled={props.readOnly}
                />
            );
        } else if (platformDataMapType === 'Text Area') {
            return (
                <ControlledTextAreaInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    disabled={props.readOnly}
                    required
                />
            );
        } else if (platformDataMapType === 'Float') {
            return (
                <ControlledFloatInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    disabled={props.readOnly}
                    required
                />
            );
        } else if (platformDataMapType === 'Int') {
            return (
                <ControlledIntegerInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    disabled={props.readOnly}
                    required
                />
            );
        } else if (
            platformDataMapType === 'CSS' ||
            platformDataMapType === 'HTML' ||
            platformDataMapType === 'JSON' ||
            platformDataMapType === 'JavaScript'
        ) {
            return (
                <ControlledCodeInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    mode={
                        platformDataMapType === 'CSS'
                            ? 'css'
                            : platformDataMapType === 'HTML'
                            ? 'html'
                            : platformDataMapType === 'JSON'
                            ? 'json'
                            : 'javascript'
                    }
                    required={false}
                    disabled={props.readOnly}
                />
            );
        } else if (platformDataMapType === 'Color') {
            return (
                <ControlledColorInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    disabled={props.readOnly}
                    sx={{ width: '100%' }}
                />
            );
        } else if (platformDataMapType === 'Country') {
            return (
                <ControlledCountrySelect
                    name="defaultValue"
                    label="Default Value"
                    variant="outlined"
                    fullWidth
                    formProps={formProps}
                />
            );
        } else if (platformDataMapType === 'DOM Selector') {
            return (
                <ControlledDomSelectorInput
                    name="defaultValue"
                    label="Default Value"
                    variant="outlined"
                    fullWidth
                    formProps={formProps}
                />
            );
        } else if (platformDataMapType === 'Date Stamp') {
            return (
                <ControlledDateStampInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                />
            );
        } else if (platformDataMapType === 'Date String') {
            return (
                <ControlledDateStringInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                />
            );
        } else if (platformDataMapType === 'DateTime Stamp') {
            return (
                <ControlledDateStampInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    includeTime
                />
            );
        } else if (platformDataMapType === 'DateTime String') {
            return (
                <ControlledDateStringInput
                    name="defaultValue"
                    label="Default Value"
                    formProps={formProps}
                    includeTime
                />
            );
        } else if (
            platformDataMapType === 'Float Array' ||
            platformDataMapType === 'Int Array' ||
            platformDataMapType === 'Text Array' ||
            platformDataMapType === 'Textarea Array'
        ) {
            return (
                <div>
                    <ArrayInput
                        contained
                        name="array-default-value"
                        label="Default Values"
                        values={defaultValues}
                        disabled={props.readOnly}
                        setValue={(v, index) => {
                            formProps.handleChange(
                                'defaultValues',
                                defaultValues.map((_, key) => {
                                    if (key === index) {
                                        return v;
                                    } else {
                                        return _;
                                    }
                                }),
                            );
                        }}
                        removeArrayElement={(v, index) => {
                            formProps.handleChange(
                                'defaultValues',
                                defaultValues.filter((_, key) => key !== index),
                            );
                        }}
                        addArrayElement={() => {
                            formProps.handleChange('defaultValues', [...defaultValues, '']);
                        }}
                        errors={new Map<number, string>()}
                        arrayType={
                            platformDataMapType === 'Int Array'
                                ? 'int'
                                : platformDataMapType === 'Float Array'
                                ? 'float'
                                : platformDataMapType === 'Text Array'
                                ? 'text'
                                : 'textarea'
                        }
                    />
                </div>
            );
        } else {
            return null;
        }
    }
};

export { DataMapDefaultValueFormSection };
