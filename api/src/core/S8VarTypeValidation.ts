import ScalarContainer from '../mongo/custom/ScalarContainer';
import S8DateTime from './S8DateTime';
import { VarType } from '../enums/VarType';
import {
    DataManagerBooleanMacros,
    DataManagerDateTimeMacros,
    DataManagerFloatMacros,
    DataManagerIntegerMacros,
    DataManagerStringMacros,
    DataManagerTimestampMacros,
} from '../enums/DataManagerMacros';
import { DataMapValue } from '../../../common/types/Types';

export default class S8VarTypeValidation {
    public static checkIngestVarTypeAndDefaultValueAlign(
        varType: VarType,
        defaultValue?: DataMapValue | ScalarContainer<DataMapValue>,
    ): boolean {
        if (typeof defaultValue === 'string') {
            if (
                varType === VarType.STRING &&
                Object.values(DataManagerStringMacros).find((_: string) => _ === defaultValue) !==
                    undefined
            ) {
                return true;
            } else if (
                varType === VarType.INT &&
                Object.values(DataManagerIntegerMacros).find((_: string) => _ === defaultValue) !==
                    undefined
            ) {
                return true;
            } else if (
                varType === VarType.FLOAT &&
                Object.values(DataManagerFloatMacros).find((_: string) => _ === defaultValue) !==
                    undefined
            ) {
                return true;
            } else if (
                varType === VarType.BOOLEAN &&
                Object.values(DataManagerBooleanMacros).find((_: string) => _ === defaultValue) !==
                    undefined
            ) {
                return true;
            } else if (
                varType === VarType.DATETIME &&
                Object.values(DataManagerDateTimeMacros).find((_: string) => _ === defaultValue) !==
                    undefined
            ) {
                return true;
            } else if (
                varType === VarType.TIMESTAMP &&
                Object.values(DataManagerTimestampMacros).find(
                    (_: string) => _ === defaultValue,
                ) !== undefined
            ) {
                return true;
            }
        }
        return this.checkVarTypeAndDefaultValueAlign(varType, defaultValue);
    }

    public static valueTypesMatch(
        varType: VarType,
        value: string | number | boolean | ScalarContainer<DataMapValue> | undefined,
    ): boolean {
        if (
            varType === VarType.DATETIME &&
            typeof value === 'string' &&
            S8DateTime.isValidDateTime(value)
        ) {
            return true;
        } else if (
            varType === VarType.TIMESTAMP &&
            typeof value === 'number' &&
            S8DateTime.isValidTimestamp(value)
        ) {
            return true;
        } else if (varType === VarType.STRING && typeof value === 'string') {
            return true;
        } else if (
            varType === VarType.INT &&
            typeof value === 'number' &&
            Number.isInteger(value)
        ) {
            return true;
        } else if (varType === VarType.FLOAT && typeof value === 'number') {
            return true;
        } else if (varType === VarType.BOOLEAN && typeof value === 'boolean') {
            return true;
        } else if (
            varType === VarType.ARRAY_STRING &&
            value instanceof ScalarContainer &&
            value.arr.every((_) => typeof _ === 'string')
        ) {
            return true;
        } else if (
            varType === VarType.ARRAY_INT &&
            value instanceof ScalarContainer &&
            value.arr.every((_) => typeof _ === 'number' && Number.isInteger(_))
        ) {
            return true;
        } else if (
            varType === VarType.ARRAY_FLOAT &&
            value instanceof ScalarContainer &&
            value.arr.every((_) => typeof _ === 'number')
        ) {
            return true;
        }
        return false;
    }

    public static checkVarTypeAndDefaultValueAlign(
        varType: VarType,
        defaultValue?: DataMapValue | ScalarContainer<DataMapValue>,
    ): boolean {
        if (defaultValue === undefined) {
            return true;
        }
        return S8VarTypeValidation.valueTypesMatch(varType, defaultValue);
    }
}
