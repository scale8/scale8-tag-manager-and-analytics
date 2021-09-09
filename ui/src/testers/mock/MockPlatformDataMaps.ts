import { buildMockPlatformDataMap } from './TestersMockBuilders';
import { InputType, VarType } from '../../gql/generated/globalTypes';

const mockPlatformDataMaps = {
    ingestEndpointPayloadDesigner: buildMockPlatformDataMap(
        VarType.STRING,
        InputType.INGEST_ENDPOINT_PAYLOAD_DESIGNER,
    ),
    checkbox: buildMockPlatformDataMap(VarType.BOOLEAN, InputType.CHECKBOX, true),
    checkboxMandatory: buildMockPlatformDataMap(VarType.BOOLEAN, InputType.CHECKBOX),
    booleanInput: buildMockPlatformDataMap(VarType.BOOLEAN, InputType.BOOLEAN_INPUT, true),
    booleanInputMandatory: buildMockPlatformDataMap(VarType.BOOLEAN, InputType.BOOLEAN_INPUT),
    text: buildMockPlatformDataMap(VarType.STRING, InputType.TEXT),
    textArea: buildMockPlatformDataMap(VarType.STRING, InputType.TEXTAREA),
    email: buildMockPlatformDataMap(VarType.STRING, InputType.EMAIL),
    color: buildMockPlatformDataMap(VarType.STRING, InputType.COLOR),
    int: buildMockPlatformDataMap(VarType.INT, InputType.INT_INPUT),
    float: buildMockPlatformDataMap(VarType.FLOAT, InputType.FLOAT_INPUT),
    domSelector: buildMockPlatformDataMap(VarType.STRING, InputType.DOM_SELECTOR_INPUT, true),
    domSelectorMandatory: buildMockPlatformDataMap(VarType.STRING, InputType.DOM_SELECTOR_INPUT),
    genericCondition: buildMockPlatformDataMap(VarType.STRING, InputType.GENERIC_CONDITION, true),
    stringCondition: buildMockPlatformDataMap(VarType.STRING, InputType.STRING_CONDITION, true),
    numberCondition: buildMockPlatformDataMap(VarType.STRING, InputType.NUMBER_CONDITION, true),
    genericConditionMandatory: buildMockPlatformDataMap(
        VarType.STRING,
        InputType.GENERIC_CONDITION,
    ),
    stringConditionMandatory: buildMockPlatformDataMap(VarType.STRING, InputType.STRING_CONDITION),
    numberConditionMandatory: buildMockPlatformDataMap(VarType.STRING, InputType.NUMBER_CONDITION),
    revisionSelect: buildMockPlatformDataMap(VarType.STRING, InputType.REVISION_SELECT, true),
    environmentSelect: buildMockPlatformDataMap(VarType.STRING, InputType.ENVIRONMENT_SELECT, true),
    consentPurposes: buildMockPlatformDataMap(VarType.STRING, InputType.CONSENT_PURPOSES, true),
    consentVendors: buildMockPlatformDataMap(VarType.STRING, InputType.CONSENT_VENDORS, true),
    revisionSelectMandatory: buildMockPlatformDataMap(VarType.STRING, InputType.REVISION_SELECT),
    environmentSelectMandatory: buildMockPlatformDataMap(
        VarType.STRING,
        InputType.ENVIRONMENT_SELECT,
    ),
    consentPurposesMandatory: buildMockPlatformDataMap(
        VarType.ARRAY_INT,
        InputType.CONSENT_PURPOSES,
    ),
    consentVendorsMandatory: buildMockPlatformDataMap(VarType.ARRAY_INT, InputType.CONSENT_VENDORS),
};

export { mockPlatformDataMaps };
