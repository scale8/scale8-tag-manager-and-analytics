import { VarType } from '../gql/generated/globalTypes';

const isVarTypeScalar = (varType: VarType): boolean => {
    switch (varType) {
        case VarType.FLOAT:
            return true;
        case VarType.INT:
            return true;
        case VarType.TIMESTAMP:
            return true;
        case VarType.DATETIME:
            return true;
        case VarType.BOOLEAN:
            return true;
        case VarType.STRING:
            return true;
        default:
            return false;
    }
};

const isVarTypeArray = (varType: VarType): boolean => {
    switch (varType) {
        case VarType.ARRAY_STRING:
            return true;
        case VarType.ARRAY_FLOAT:
            return true;
        case VarType.ARRAY_INT:
            return true;
        default:
            return false;
    }
};

const isVarTypeObject = (varType: VarType): boolean => {
    switch (varType) {
        case VarType.OBJECT:
            return true;
        case VarType.ARRAY_OBJECT:
            return true;
        default:
            return false;
    }
};

const isValueFromPlatform = (value: S8DataMapValue): boolean => {
    if (typeof value === 'string') {
        return /^{{[^}]+}}$/.test(value);
    }

    return false;
};

export { isVarTypeScalar, isVarTypeArray, isVarTypeObject, isValueFromPlatform };
