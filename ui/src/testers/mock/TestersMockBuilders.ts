import { PlatformDataMap } from '../../types/DataMapsTypes';
import { Platform, PlatformAction } from '../../types/TagRulesTypes';
import { InputType, VarType } from '../../gql/generated/globalTypes';
import { buildMockComponentId } from '../../utils/TextUtils';

const buildMockPlatformAction = (
    name: string,
    platform_data_maps: PlatformDataMap[],
): PlatformAction => ({
    id: buildMockComponentId(name),
    name,
    description: '...',
    platform_data_maps,
    platform: {} as Platform,
    __typename: 'PlatformAction',
});

const buildMockPlatformDataMapObject = (
    var_type: VarType,
    input_type: InputType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    child_platform_data_maps: PlatformDataMap[] = [],
    isOptional?: boolean,
    key?: string,
    options?: string[],
): PlatformDataMap => ({
    id: buildMockComponentId(input_type),
    key: key ?? `${input_type}`,
    var_type,
    input_type,
    is_optional: !!isOptional,
    default_value: null,
    option_values: options ?? null,
    validation_rules: null,
    description: '...',
    __typename: 'PlatformDataMap',
    child_platform_data_maps: [],
});

const buildMockPlatformDataMap = (
    var_type: VarType,
    input_type: InputType,
    isOptional?: boolean,
    key?: string,
    options?: string[],
): PlatformDataMap => {
    return buildMockPlatformDataMapObject(var_type, input_type, [], isOptional, key, options);
};

export { buildMockPlatformAction, buildMockPlatformDataMap, buildMockPlatformDataMapObject };
