import { snakeToTitleCase } from './TextUtils';
import {
    DataMapDefaultValue,
    DataMapDefaultValueContainer,
    DataMapDefaultValueContainerArray,
} from '../types/DataMapsTypes';
import { VarType } from '../gql/generated/globalTypes';
import { dateStringDisplay, timestampDisplay } from './DateTimeUtils';

const buildDataMapLabel = (key: string): string => snakeToTitleCase(key);

const dataMapValueToString = (value: S8DataMapValue | S8DataMapValue[]): string => {
    if (Array.isArray(value)) return value.map((_) => dataMapValueToString(_)).join(', ');

    if (value === true) return 'True';
    if (value === false) return 'False';

    return value.toString();
};

const getDefaultScalarValue: (defaultValue: DataMapDefaultValue | null) => S8DataMapValue | null = (
    defaultValue: DataMapDefaultValue | null,
) => {
    if (
        defaultValue === null ||
        defaultValue === undefined ||
        (defaultValue as DataMapDefaultValueContainer).value === undefined ||
        (defaultValue as DataMapDefaultValueContainer).value === null
    ) {
        return null;
    }

    return (defaultValue as DataMapDefaultValueContainer).value;
};

const getDefaultArrayValueString = (defaultArrayValue: S8DataMapValue[]): string => {
    if (defaultArrayValue.length === 0) {
        return '[]';
    }
    return `[ ${defaultArrayValue.map((_) => (_ === null ? '' : _.toString())).join(', ')} ]`;
};

const getDefaultArrayValue: (defaultValue: DataMapDefaultValue | null) => S8DataMapValue[] | null =
    (defaultValue: DataMapDefaultValue | null) => {
        if (
            defaultValue === null ||
            defaultValue === undefined ||
            (defaultValue as DataMapDefaultValueContainerArray).values === undefined ||
            (defaultValue as DataMapDefaultValueContainerArray).values === null
        ) {
            return null;
        }

        return (defaultValue as DataMapDefaultValueContainerArray).values;
    };

const getDefaultScalarValueString = (
    defaultScalarValue: S8DataMapValue | null,
    varType: VarType,
    allowMacros = true,
): string => {
    if (defaultScalarValue === null) {
        return '-';
    }

    if (
        allowMacros &&
        typeof defaultScalarValue === 'string' &&
        defaultScalarValue.startsWith('%') &&
        defaultScalarValue.endsWith('%')
    ) {
        return defaultScalarValue;
    }

    if (varType === VarType.DATETIME) {
        return dateStringDisplay(defaultScalarValue.toString());
    }

    if (varType === VarType.TIMESTAMP) {
        return timestampDisplay(defaultScalarValue as number);
    }

    if (varType === VarType.STRING) {
        return `"${defaultScalarValue}"`;
    }

    return defaultScalarValue.toString();
};

const getDefaultValueString: (
    defaultValue: DataMapDefaultValue | null,
    varType: VarType,
) => string = (defaultValue: DataMapDefaultValue | null, varType: VarType) => {
    const defaultArrayValue = getDefaultArrayValue(defaultValue);
    const defaultScalarValue = getDefaultScalarValue(defaultValue);

    if (defaultArrayValue !== null) {
        return getDefaultArrayValueString(defaultArrayValue);
    }

    return getDefaultScalarValueString(defaultScalarValue, varType);
};

const getDefaultValueArray: (defaultValue: DataMapDefaultValue | null) => S8DataMapValue[] = (
    defaultValue: DataMapDefaultValue | null,
) => {
    const defaultArrayValue = getDefaultArrayValue(defaultValue);
    const defaultScalarValue = getDefaultScalarValue(defaultValue);

    if (defaultArrayValue !== null) {
        return defaultArrayValue;
    }
    if (defaultScalarValue === null) {
        return [];
    }
    return [defaultScalarValue];
};

export {
    buildDataMapLabel,
    dataMapValueToString,
    getDefaultValueString,
    getDefaultValueArray,
    getDefaultArrayValueString,
    getDefaultScalarValueString,
};
