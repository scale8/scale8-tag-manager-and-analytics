import { FC, FocusEventHandler } from 'react';
import { InputType } from '../../../gql/generated/globalTypes';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import DateStringInput from './DateStringInput';
import DateStampInput from './DateStampInput';
import ColorInput from './ColorInput';
import IntegerInput from './IntegerInput';
import FloatInput from './FloatInput';
import ArrayInput from './ArrayInput';
import CodeInput from './CodeInput';
import SelectInput from './SelectInput';
import BooleanInput from './BooleanInput';
import CountrySelect from './CountrySelect';
import { dataMapValueToString } from '../../../utils/DataMapUtils';
import IngestEndpointPayloadInputType from '../../molecules/IngestEndpointPayloadInputType';
import { AppPlatformRevision } from '../../../types/TagRulesTypes';
import { IngestEndpointForEnvironmentSelection } from '../../../types/IngestEndpointsTypes';
import DomSelectorInput from './DomSelectorInput';
import { matchConditionValues } from '../../../utils/MatchConditionValues';
import CheckBoxInput from './CheckBoxInput';
import RadioInput from './RadioInput';
import TextInputWithMacros from './TextInputWithMacros';
import IntegerSelectInput from './IntegerSelectInput';
import MultipleSelectInput from './MultipleSelectInput';

export type FormElementWithInputTypeProps = {
    name: string;
    label: string;
    values: S8DataMapValue[];
    setValues?: (v: S8DataMapValue[]) => void;
    setValue: (v: S8DataMapValue, index: number) => void;
    removeArrayElement: (dataMapId: string, index: number) => void;
    addArrayElement: (dataMapId: string) => void;
    errors: Map<number, string>;
    inputType: InputType;
    required: boolean;
    disabled: boolean;
    optionValues: S8DataMapValue[];
    defaultValue: S8DataMapValue | null;
    onBlur?: FocusEventHandler<any>;
    appPlatformRevisions?: AppPlatformRevision[];
    ingestEndpoints?: IngestEndpointForEnvironmentSelection[];
    environments?: { id: string; name: string }[];
    revisions?: { id: string; name: string }[];
    consentPurposes?: { id: number; name: string }[];
    consentVendors?: { id: number; name: string }[];
    flatten: boolean;
};

export const FormElementWithInputType: FC<FormElementWithInputTypeProps> = (
    props: FormElementWithInputTypeProps,
) => {
    const {
        inputType,
        values,
        setValue,
        setValues,
        flatten,
        removeArrayElement,
        addArrayElement,
        errors,
        optionValues,
        appPlatformRevisions,
        ingestEndpoints,
        revisions,
        environments,
        consentPurposes,
        consentVendors,
        defaultValue,
        ...inputProps
    } = props;

    const sxStyle = { width: '100%' };

    if (inputType === InputType.OBJECT_ARRAY_INPUT || inputType === InputType.OBJECT_INPUT) {
        return null;
    } else if (
        inputType === InputType.TEXT ||
        inputType === InputType.URL ||
        inputType === InputType.EMAIL ||
        (flatten && inputType === InputType.TEXT_ARRAY_INPUT)
    ) {
        return (
            <TextInput
                value={dataMapValueToString(values[0])}
                setValue={(v) => setValue(v, 0)}
                sx={sxStyle}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                {...inputProps}
            />
        );
    } else if (
        inputType === InputType.URL_WITH_MACRO_SUPPORT ||
        inputType === InputType.TEXT_WITH_MACRO_SUPPORT
    ) {
        return (
            <TextInputWithMacros
                value={dataMapValueToString(values[0])}
                setValue={(v) => setValue(v, 0)}
                sx={sxStyle}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                appPlatformRevisions={appPlatformRevisions}
                {...inputProps}
            />
        );
    } else if (
        inputType === InputType.TEXTAREA ||
        (flatten && inputType === InputType.TEXTAREA_ARRAY_INPUT) ||
        (flatten && inputType === InputType.HTML) ||
        (flatten && inputType === InputType.CSS) ||
        (flatten && inputType === InputType.JAVASCRIPT) ||
        (flatten && inputType === InputType.JSON)
    ) {
        return (
            <TextAreaInput
                value={dataMapValueToString(values[0])}
                setValue={(v) => setValue(v, 0)}
                sx={sxStyle}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.DOM_SELECTOR_INPUT) {
        return (
            <DomSelectorInput
                value={dataMapValueToString(values[0])}
                setValue={(v) => setValue(v, 0)}
                sx={sxStyle}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.DATE_STRING) {
        return (
            <DateStringInput
                value={values[0].toString()}
                setValue={(v) => setValue(v, 0)}
                sx={sxStyle}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.DATE_STAMP) {
        return (
            <DateStampInput
                value={Number.isInteger(values[0]) ? (values[0] as number) : ''}
                setValue={(v) => setValue(v, 0)}
                sx={sxStyle}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.DATETIME_STRING) {
        return (
            <DateStringInput
                value={values[0].toString()}
                setValue={(v) => setValue(v, 0)}
                sx={sxStyle}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                includeTime
                {...inputProps}
            />
        );
    } else if (inputType === InputType.DATETIME_STAMP) {
        return (
            <DateStampInput
                value={Number.isInteger(values[0]) ? (values[0] as number) : ''}
                setValue={(v) => setValue(v, 0)}
                sx={sxStyle}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                includeTime
                {...inputProps}
            />
        );
    } else if (inputType === InputType.COLOR) {
        return (
            <ColorInput
                value={values[0].toString()}
                setValue={(v) => setValue(v, 0)}
                sx={sxStyle}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.INT_INPUT) {
        return (
            <IntegerInput
                value={Number.isInteger(values[0]) ? (values[0] as number) : ''}
                setValue={(v) => setValue(v, 0)}
                sx={sxStyle}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.FLOAT_INPUT) {
        return (
            <FloatInput
                value={isNaN(parseFloat(values[0].toString())) ? '' : (values[0] as number)}
                setValue={(v) => setValue(v, 0)}
                sx={sxStyle}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.INT_ARRAY_INPUT) {
        return (
            <ArrayInput
                contained
                values={values}
                setValue={setValue}
                removeArrayElement={removeArrayElement}
                addArrayElement={addArrayElement}
                errors={errors}
                arrayType="int"
                {...inputProps}
            />
        );
    } else if (inputType === InputType.FLOAT_ARRAY_INPUT) {
        return (
            <ArrayInput
                contained
                values={values}
                setValue={setValue}
                removeArrayElement={removeArrayElement}
                addArrayElement={addArrayElement}
                errors={errors}
                arrayType="float"
                {...inputProps}
            />
        );
    } else if (inputType === InputType.TEXT_ARRAY_INPUT) {
        return (
            <ArrayInput
                contained
                values={values}
                setValue={setValue}
                removeArrayElement={removeArrayElement}
                addArrayElement={addArrayElement}
                errors={errors}
                arrayType="text"
                {...inputProps}
            />
        );
    } else if (inputType === InputType.TEXTAREA_ARRAY_INPUT) {
        return (
            <ArrayInput
                contained
                values={values}
                setValue={setValue}
                removeArrayElement={removeArrayElement}
                addArrayElement={addArrayElement}
                errors={errors}
                arrayType="textarea"
                {...inputProps}
            />
        );
    } else if (inputType === InputType.JAVASCRIPT) {
        return (
            <CodeInput
                value={values[0].toString()}
                mode="javascript"
                setValue={(v) => setValue(v, 0)}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.CSS) {
        return (
            <CodeInput
                value={values[0].toString()}
                mode="css"
                setValue={(v) => setValue(v, 0)}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.HTML) {
        return (
            <CodeInput
                value={values[0].toString()}
                mode="html"
                setValue={(v) => setValue(v, 0)}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.JSON) {
        return (
            <CodeInput
                value={values[0].toString()}
                mode="json"
                setValue={(v) => setValue(v, 0)}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                {...inputProps}
            />
        );
    } else if (
        inputType === InputType.SELECT ||
        (flatten && inputType === InputType.MULTIPLE_SELECT)
    ) {
        return (
            <SelectInput
                value={values[0].toString()}
                setValue={(v) => setValue(v, 0)}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                sx={sxStyle}
                optionValues={optionValues}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.MULTIPLE_SELECT) {
        return (
            <MultipleSelectInput
                value={values[0] === '' ? [] : (values as string[])}
                setValue={(v) => (setValues !== undefined ? setValues(v) : setValue(v[0], 0))}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                sx={sxStyle}
                optionValues={optionValues}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.RADIO) {
        return (
            <RadioInput
                defaultValue={defaultValue?.toString() || ''}
                value={values[0].toString()}
                setValue={(v: string) => setValue(v, 0)}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                sx={sxStyle}
                optionValues={optionValues}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.BOOLEAN_INPUT) {
        return (
            <BooleanInput
                value={values[0] === '' ? '' : !!values[0]}
                setValue={(v) => setValue(v, 0)}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                sx={sxStyle}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.CHECKBOX) {
        const defaultBoolean = defaultValue === true;
        return (
            <CheckBoxInput
                value={values[0] === '' ? defaultBoolean : !!values[0]}
                setValue={(v) => setValue(v, 0)}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                sx={sxStyle}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.COUNTRY_CODE_SELECT) {
        return (
            <CountrySelect
                value={dataMapValueToString(values[0])}
                setValue={(v) => setValue(v, 0)}
                sx={sxStyle}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.INGEST_ENDPOINT_PAYLOAD_DESIGNER) {
        return (
            <IngestEndpointPayloadInputType
                appPlatformRevisions={appPlatformRevisions}
                ingestEndpoints={ingestEndpoints}
                setValue={(v) => setValue(v, 0)}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                value={dataMapValueToString(values[0])}
                disabled={inputProps.disabled}
            />
        );
    } else if (inputType === InputType.STRING_CONDITION) {
        return (
            <SelectInput
                value={values[0].toString()}
                setValue={(v) => setValue(v, 0)}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                sx={sxStyle}
                optionValues={[]}
                keyTextValues={matchConditionValues
                    .filter((matchConditionValue) =>
                        matchConditionValue.types.includes('StringCondition'),
                    )
                    .map((matchConditionValue) => ({
                        key: matchConditionValue.condition,
                        text: `${matchConditionValue.symbol} (${matchConditionValue.text})`,
                    }))}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.GENERIC_CONDITION) {
        return (
            <SelectInput
                value={values[0].toString()}
                setValue={(v) => setValue(v, 0)}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                sx={sxStyle}
                optionValues={[]}
                keyTextValues={matchConditionValues
                    .filter((matchConditionValue) => matchConditionValue.types.includes('Custom'))
                    .map((matchConditionValue) => ({
                        key: matchConditionValue.condition,
                        text: `${matchConditionValue.symbol} (${matchConditionValue.text})`,
                    }))}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.NUMBER_CONDITION) {
        return (
            <SelectInput
                value={values[0].toString()}
                setValue={(v) => setValue(v, 0)}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                sx={sxStyle}
                optionValues={[]}
                keyTextValues={matchConditionValues
                    .filter((matchConditionValue) =>
                        matchConditionValue.types.includes('NumberCondition'),
                    )
                    .map((matchConditionValue) => ({
                        key: matchConditionValue.condition,
                        text: `${matchConditionValue.symbol} (${matchConditionValue.text})`,
                    }))}
                {...inputProps}
            />
        );
    } else if (inputType === InputType.REVISION_SELECT) {
        return (
            <SelectInput
                value={values[0].toString()}
                setValue={(v) => setValue(v, 0)}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                sx={sxStyle}
                optionValues={[]}
                keyTextValues={
                    revisions === undefined
                        ? []
                        : revisions.map((_) => ({
                              key: _.id,
                              text: _.name,
                          }))
                }
                {...inputProps}
            />
        );
    } else if (inputType === InputType.ENVIRONMENT_SELECT) {
        return (
            <SelectInput
                value={values[0].toString()}
                setValue={(v) => setValue(v, 0)}
                validationError={errors.has(0) ? errors.get(0) : undefined}
                sx={sxStyle}
                optionValues={[]}
                keyTextValues={
                    environments === undefined
                        ? []
                        : environments.map((_) => ({
                              key: _.id,
                              text: _.name,
                          }))
                }
                {...inputProps}
            />
        );
    } else if (
        inputType === InputType.CONSENT_PURPOSES ||
        inputType === InputType.CONSENT_VENDORS
    ) {
        const consentEntity = (() => {
            if (inputType === InputType.CONSENT_PURPOSES) return consentPurposes;
            return consentVendors;
        })();

        return (
            <IntegerSelectInput
                multiple={setValues !== undefined}
                value={values as number[]}
                setValue={(v) =>
                    setValues !== undefined ? setValues(v as number[]) : setValue(v as number, 0)
                }
                validationError={errors.has(0) ? errors.get(0) : undefined}
                sx={sxStyle}
                keyTextValues={
                    consentEntity === undefined
                        ? []
                        : consentEntity.map((_) => ({
                              key: _.id,
                              text: _.name,
                          }))
                }
                {...inputProps}
            />
        );
    } else {
        return <p>Input type {inputType} not implemented</p>;
    }
};
