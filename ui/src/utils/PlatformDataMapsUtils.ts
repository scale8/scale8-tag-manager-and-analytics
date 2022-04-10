import {
    DataMap,
    DataMapDefaultValue,
    PlatformDataMap,
    PlatformDataMapInput,
} from '../types/DataMapsTypes';
import { TypeIcon, VarType } from '../gql/generated/globalTypes';
import { MappedPlatformElement } from '../types/MappedPlatformValuesTypes';
import {
    getPlatformDataMapBuildSample,
    getPlatformDataMapInputType,
    getPlatformDataMapVarType,
} from './PlatformDataMapTypeUtils';
import { mappedPlatformValuesFromDataMapsWithValues } from './MappedPlatformValuesUtils';

type SubAndDeeper = {
    id: string;
    keys: string[];
    icon?: TypeIcon | null;
    varType: VarType;
    description: string;
    sub?: {
        id: string;
        varType: VarType;
        icon?: TypeIcon | null;
        description: string;
        key: string;
    }[];
    deeper: PlatformDataMap[];
};

const platformDataMapHasChildren = (platformDataMap: PlatformDataMap): boolean =>
    Array.isArray((platformDataMap as any).child_platform_data_maps) &&
    (platformDataMap as any).child_platform_data_maps.length > 0;

const platformDataMapToSubAndDeeper = (
    platformDataMap: PlatformDataMap,
    previousKeys: string[] = [],
): SubAndDeeper => {
    return {
        id: platformDataMap.id,
        varType: platformDataMap.var_type,
        description: platformDataMap.description,
        keys: [...previousKeys, platformDataMap.key],
        sub: platformDataMapHasChildren(platformDataMap)
            ? (platformDataMap as any).child_platform_data_maps
                  .map((_: PlatformDataMap) => {
                      return platformDataMapHasChildren(_)
                          ? null
                          : {
                                id: _.id,
                                varType: _.var_type,
                                icon: _.icon,
                                description: _.description,
                                key: _.key,
                            };
                  })
                  .filter((_: PlatformDataMap | null) => _ != null)
            : undefined,
        deeper: platformDataMapHasChildren(platformDataMap)
            ? (platformDataMap as any).child_platform_data_maps
                  .map((_: PlatformDataMap) => {
                      return platformDataMapHasChildren(_) ? _ : null;
                  })
                  .filter((_: PlatformDataMap | null) => _ != null)
            : [],
    };
};

const platformDataMapsToSubAndDeeper = (
    platformDataMaps: PlatformDataMap[],
    previousKeys: string[] = [],
): SubAndDeeper[] => {
    return platformDataMaps
        .map((platformDataMap) => {
            const subAndDeeper = platformDataMapToSubAndDeeper(platformDataMap, previousKeys);
            if (subAndDeeper.deeper.length > 0) {
                if (subAndDeeper.sub && subAndDeeper.sub.length > 0) {
                    return [
                        platformDataMapsToSubAndDeeper(subAndDeeper.deeper, [
                            ...previousKeys,
                            platformDataMap.key,
                        ]),
                        subAndDeeper,
                    ].flat();
                }
                return platformDataMapsToSubAndDeeper(subAndDeeper.deeper, [
                    ...previousKeys,
                    platformDataMap.key,
                ]);
            } else return subAndDeeper;
        })
        .flat();
};

// assume max nested values 3
const getCurrentDataMapInputFromParentsIndexes = (
    parentsIndexes: number[],
    platformDataMaps: PlatformDataMapInput[],
): PlatformDataMapInput[] => {
    if (parentsIndexes.length === 0) return platformDataMaps;

    if (parentsIndexes.length === 1) {
        return platformDataMaps[parentsIndexes[0]].child_platform_data_maps;
    }

    if (parentsIndexes.length === 2) {
        return platformDataMaps[parentsIndexes[0]].child_platform_data_maps[parentsIndexes[1]]
            .child_platform_data_maps;
    }

    return [];
};

const buildPlatformDataMapDefaultFromInput = (
    default_value: S8DataMapValue | undefined,
    default_values: S8DataMapValue[] | undefined,
): DataMapDefaultValue | null => {
    if (default_values !== undefined) {
        return {
            __typename: 'DefaultValueContainerArray',
            values: default_values,
        } as DataMapDefaultValue;
    } else if (default_value !== undefined) {
        return {
            __typename: 'DefaultValueContainer',
            value: default_value,
        } as DataMapDefaultValue;
    } else {
        return null;
    }
};

const buildPlatformDataMapFromInput = (input: PlatformDataMapInput): PlatformDataMap => {
    return {
        __typename: 'PlatformDataMap',
        id: '',
        key: input.key,
        var_type: getPlatformDataMapVarType(input.type),
        input_type: getPlatformDataMapInputType(input.type),
        is_optional: input.optional,
        description: input.description,
        option_values: input.option_values ?? null,
        validation_rules: input.validation_rules ?? null,
        default_value: buildPlatformDataMapDefaultFromInput(
            input.default_value,
            input.default_values,
        ),
        child_platform_data_maps: input.child_platform_data_maps.map((_) =>
            buildPlatformDataMapFromInput(_),
        ),
    };
};

const buildSampleFromDataMapInput = (
    input: PlatformDataMapInput,
    indexArray: number[],
): DataMap => {
    const var_type = getPlatformDataMapVarType(input.type);

    return {
        __typename: 'DataMap',
        id: `${var_type}_${indexArray.join('_')}`,
        key: input.key,
        var_type: getPlatformDataMapVarType(input.type),
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        value: buildSampleValueForType(input, indexArray),
    };
};

const buildPlatformDataMapPayload = (
    dataMaps: PlatformDataMapInput[],
    indexArray: number[] = [],
): DataMap[] => {
    return dataMaps.map((_, index) => buildSampleFromDataMapInput(_, [...indexArray, index]));
};

const buildSampleValueForType = (
    input: PlatformDataMapInput,
    indexArray: number[],
): {
    value?: any;
    values?: any[];
    object?: DataMap[];
    objects?: DataMap[][];
} => {
    const type = input.type;
    if (type === 'Object') {
        return {
            object: buildPlatformDataMapPayload(input.child_platform_data_maps, indexArray),
        };
    } else if (type === 'Object Array') {
        return {
            objects: [
                buildPlatformDataMapPayload(input.child_platform_data_maps, [...indexArray, 0]),
                buildPlatformDataMapPayload(input.child_platform_data_maps, [...indexArray, 1]),
            ],
        };
    } else {
        return getPlatformDataMapBuildSample(type)(indexArray, input.option_values ?? []);
    }
};

const buildPlatformDataMapSample = (dataMaps: DataMap[]): Record<string, unknown> => {
    return dataMaps.reduce((accumulator, currentValue) => {
        if (currentValue.value === null) {
            return accumulator;
        }
        if (currentValue.value.object !== undefined) {
            return {
                ...accumulator,
                [currentValue.key]: buildPlatformDataMapSample(currentValue.value.object),
            };
        }
        if (currentValue.value.objects !== undefined) {
            return {
                ...accumulator,
                [currentValue.key]: currentValue.value.objects.map((obj) =>
                    buildPlatformDataMapSample(obj),
                ),
            };
        }
        if (currentValue.value.value !== undefined) {
            return {
                ...accumulator,
                [currentValue.key]: currentValue.value.value,
            };
        }
        if (currentValue.value.values !== undefined) {
            return {
                ...accumulator,
                [currentValue.key]: currentValue.value.values,
            };
        }
        return accumulator;
    }, {});
};

const buildPlatformDataMapPlatformElements = (
    dataMaps: PlatformDataMapInput[],
): MappedPlatformElement[] => {
    return mappedPlatformValuesFromDataMapsWithValues(
        dataMaps.map((_) => buildPlatformDataMapFromInput(_)),
        buildPlatformDataMapPayload(dataMaps),
    );
};

export {
    platformDataMapsToSubAndDeeper,
    platformDataMapHasChildren,
    getCurrentDataMapInputFromParentsIndexes,
    buildPlatformDataMapPlatformElements,
    buildPlatformDataMapPayload,
    buildPlatformDataMapSample,
};
