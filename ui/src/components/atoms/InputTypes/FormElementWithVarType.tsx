import { FC } from 'react';
import TextInput from './TextInput';
import IntegerInput from './IntegerInput';
import FloatInput from './FloatInput';
import ArrayInput from './ArrayInput';
import BooleanInput from './BooleanInput';
import { dataMapValueToString } from '../../../utils/DataMapUtils';
import { VarType } from '../../../gql/generated/globalTypes';
import DateStampInput from './DateStampInput';
import DateStringInput from './DateStringInput';

export type FormElementWithVarTypeProps = {
    name: string;
    values: S8DataMapValue[];
    setValue: (v: S8DataMapValue, index: number) => void;
    removeArrayElement: (index: number) => void;
    addArrayElement: () => void;
    varType: VarType;
    arrayContained: boolean;
    disabled: boolean;
};

const FormElementWithVarType: FC<FormElementWithVarTypeProps> = (
    props: FormElementWithVarTypeProps,
) => {
    const { varType, values, setValue, removeArrayElement, addArrayElement, name, disabled } =
        props;

    const sxStyle = { width: '100%', marginBottom: '8px' };

    if (varType === VarType.STRING) {
        return (
            <TextInput
                required
                value={dataMapValueToString(values[0])}
                setValue={(v) => setValue(v, 0)}
                name={name}
                variant="standard"
                sx={sxStyle}
                disabled={disabled}
            />
        );
    }

    if (varType === VarType.BOOLEAN) {
        return (
            <BooleanInput
                required
                value={values[0] === '' ? '' : !!values[0]}
                setValue={(v) => setValue(v, 0)}
                name={name}
                variant="standard"
                sx={sxStyle}
                disabled={disabled}
            />
        );
    }

    if (varType === VarType.DATETIME) {
        return (
            <DateStringInput
                required
                value={values[0].toString()}
                setValue={(v) => setValue(v, 0)}
                name={name}
                sx={sxStyle}
                disabled={disabled}
                includeTime
            />
        );
    }

    if (varType === VarType.TIMESTAMP) {
        return (
            <DateStampInput
                required
                value={Number.isInteger(values[0]) ? (values[0] as number) : ''}
                setValue={(v) => setValue(v, 0)}
                name={name}
                sx={sxStyle}
                disabled={disabled}
                includeTime
            />
        );
    }

    if (varType === VarType.INT) {
        return (
            <IntegerInput
                required
                value={Number.isInteger(values[0]) ? (values[0] as number) : ''}
                setValue={(v) => setValue(v, 0)}
                name={name}
                style={{ width: '100%', marginBottom: '8px' }}
                disabled={disabled}
            />
        );
    }

    if (varType === VarType.FLOAT) {
        return (
            <FloatInput
                required
                value={isNaN(parseFloat(values[0].toString())) ? '' : (values[0] as number)}
                setValue={(v) => setValue(v, 0)}
                name={name}
                style={{ width: '100%', marginBottom: '8px' }}
                disabled={disabled}
            />
        );
    }

    if (varType === VarType.ARRAY_STRING) {
        return (
            <ArrayInput
                contained={props.arrayContained}
                values={values}
                setValue={setValue}
                removeArrayElement={(name, index: number) => removeArrayElement(index)}
                addArrayElement={addArrayElement}
                arrayType="text"
                name={name}
                size="small"
                disabled={disabled}
            />
        );
    }

    if (varType === VarType.ARRAY_INT) {
        return (
            <ArrayInput
                contained={props.arrayContained}
                values={values}
                setValue={setValue}
                removeArrayElement={(name, index: number) => removeArrayElement(index)}
                addArrayElement={addArrayElement}
                arrayType="int"
                name={name}
                size="small"
                disabled={disabled}
            />
        );
    }

    if (varType === VarType.ARRAY_FLOAT) {
        return (
            <ArrayInput
                contained={props.arrayContained}
                values={values}
                setValue={setValue}
                removeArrayElement={(name, index: number) => removeArrayElement(index)}
                addArrayElement={addArrayElement}
                arrayType="float"
                name={name}
                size="small"
                disabled={disabled}
            />
        );
    }

    return null;
};

export { FormElementWithVarType };
