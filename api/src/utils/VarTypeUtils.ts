import { VarType } from '../enums/VarType';
import { InputType } from '../../../common/enums/InputType';

const inputToVarTypeMap: Map<InputType, VarType> = new Map([
    [InputType.FLOAT_ARRAY_INPUT, VarType.ARRAY_FLOAT],
    [InputType.INT_ARRAY_INPUT, VarType.ARRAY_INT],
    [InputType.TEXT_ARRAY_INPUT, VarType.ARRAY_STRING],
    [InputType.TEXTAREA_ARRAY_INPUT, VarType.ARRAY_STRING],
    [InputType.BOOLEAN_INPUT, VarType.BOOLEAN],
    [InputType.CHECKBOX, VarType.BOOLEAN],
    [InputType.RADIO, VarType.STRING],
    [InputType.SELECT, VarType.STRING],
    [InputType.COUNTRY_CODE_SELECT, VarType.STRING],
    [InputType.ENVIRONMENT_SELECT, VarType.STRING],
    [InputType.REVISION_SELECT, VarType.STRING],
    [InputType.GENERIC_CONDITION, VarType.STRING],
    [InputType.STRING_CONDITION, VarType.STRING],
    [InputType.NUMBER_CONDITION, VarType.STRING],
    [InputType.DOM_SELECTOR_INPUT, VarType.STRING],
    [InputType.DATE_STRING, VarType.DATETIME],
    [InputType.DATETIME_STRING, VarType.DATETIME],
    [InputType.FLOAT_INPUT, VarType.FLOAT],
    [InputType.INT_INPUT, VarType.INT],
    [InputType.OBJECT_INPUT, VarType.OBJECT],
    [InputType.OBJECT_ARRAY_INPUT, VarType.ARRAY_OBJECT],
    [InputType.TEXT, VarType.STRING],
    [InputType.TEXT_WITH_MACRO_SUPPORT, VarType.STRING],
    [InputType.TEXTAREA, VarType.STRING],
    [InputType.JAVASCRIPT, VarType.STRING],
    [InputType.JSON, VarType.STRING],
    [InputType.HTML, VarType.STRING],
    [InputType.CSS, VarType.STRING],
    [InputType.COLOR, VarType.STRING],
    [InputType.URL, VarType.STRING],
    [InputType.URL_WITH_MACRO_SUPPORT, VarType.STRING],
    [InputType.EMAIL, VarType.STRING],
    [InputType.DATE_STAMP, VarType.TIMESTAMP],
    [InputType.DATETIME_STAMP, VarType.TIMESTAMP],
    [InputType.INGEST_ENDPOINT_PAYLOAD_DESIGNER, VarType.STRING],
    [InputType.CONSENT_VENDORS, VarType.ARRAY_INT],
    [InputType.CONSENT_PURPOSES, VarType.ARRAY_INT],
    [InputType.MULTIPLE_SELECT, VarType.ARRAY_STRING],
]);

const getVarTypeFromInputType = (inputType: InputType): VarType => {
    const varType = inputToVarTypeMap.get(inputType);
    if (varType === undefined) {
        throw new Error('Failed to find varType for ' + inputType);
    }
    return varType;
};

export { inputToVarTypeMap, getVarTypeFromInputType };
