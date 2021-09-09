import { DataMapInput, VarType } from '../gql/generated/globalTypes';
import { MappedPlatformElement, MappedPlatformValues } from '../types/MappedPlatformValuesTypes';
import { mappedPlatformValuesToDataMapInput } from './MappedPlatformValuesUtils';
import {
    DataMap,
    DataMapDefaultValueContainer,
    DataMapDefaultValueContainerArray,
    PlatformDataMap,
} from '../types/DataMapsTypes';
import { platformDataMapHasChildren } from './PlatformDataMapsUtils';
import { isVarTypeArray, isVarTypeObject } from './VarTypeUtils';

const findNestedPlatformElementAndChange = (
    mappedPlatformValues: MappedPlatformValues,
    changeFunction: (mappedPlatformElement: MappedPlatformElement) => MappedPlatformElement,
    parentLocators: { id: string; index: number }[],
): MappedPlatformValues => {
    return mappedPlatformValues.map((mappedPlatformElement) => {
        if (parentLocators.length === 0) {
            return changeFunction(mappedPlatformElement);
        } else if (mappedPlatformElement.platformDataMap.id === parentLocators[0].id) {
            return {
                ...mappedPlatformElement,
                children: mappedPlatformElement.children.map((childElement, key) => {
                    if (key === parentLocators[0].index) {
                        const [, ...otherLocators] = parentLocators;
                        return findNestedPlatformElementAndChange(
                            childElement,
                            changeFunction,
                            otherLocators,
                        );
                    } else {
                        return childElement;
                    }
                }),
            };
        } else {
            return mappedPlatformElement;
        }
    });
};

const mappedPlatformElementToDataMapInput = (
    mappedPlatformElement: MappedPlatformElement,
): DataMapInput | undefined => {
    if (
        mappedPlatformElement.platformDataMap.is_optional &&
        mappedPlatformElement.values[0] === ''
    ) {
        return undefined;
    }

    const dataVarType: VarType = mappedPlatformElement.platformDataMap.var_type;

    return {
        key: mappedPlatformElement.platformDataMap.key,
        var_type: dataVarType,
        value: isVarTypeArray(dataVarType) ? undefined : mappedPlatformElement.values[0],
        values:
            !isVarTypeArray(dataVarType) || isVarTypeObject(dataVarType)
                ? undefined
                : mappedPlatformElement.values,
        children:
            dataVarType !== VarType.OBJECT
                ? undefined
                : mappedPlatformValuesToDataMapInput(mappedPlatformElement.children[0]),
        repeated_children:
            dataVarType !== VarType.ARRAY_OBJECT
                ? undefined
                : mappedPlatformElement.children.map((child) =>
                      mappedPlatformValuesToDataMapInput(child),
                  ),
    };
};

const extractDataMapDefaultValue = (platformDataMap: PlatformDataMap): S8DataMapValue | null => {
    return platformDataMap.default_value !== null &&
        platformDataMap.default_value.hasOwnProperty('value') &&
        (platformDataMap.default_value as DataMapDefaultValueContainer).value !== null
        ? (platformDataMap.default_value as DataMapDefaultValueContainer).value
        : null;
};

const extractDataMapDefaultValues = (platformDataMap: PlatformDataMap): S8DataMapValue[] | null => {
    return platformDataMap.default_value !== null &&
        platformDataMap.default_value.hasOwnProperty('values') &&
        (platformDataMap.default_value as DataMapDefaultValueContainerArray).values !== null
        ? (platformDataMap.default_value as DataMapDefaultValueContainerArray).values
        : null;
};

const mappedPlatformElementAddChild = (platformData: MappedPlatformElement): void => {
    if (platformDataMapHasChildren(platformData.platformDataMap)) {
        platformData.children.push(
            (platformData.platformDataMap as any).child_platform_data_maps.map(
                (childPlatformDataMap: PlatformDataMap): MappedPlatformElement =>
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    mappedPlatformElementFromDataMap(childPlatformDataMap),
            ),
        );
    }
};

const mappedPlatformElementFromDataMap = (
    platformDataMap: PlatformDataMap,
): MappedPlatformElement => {
    const platformData: MappedPlatformElement = {
        platformDataMap,
        errors: new Map<number, string>(),
        values: [],
        children: [],
    };

    const defaultValue = extractDataMapDefaultValue(platformDataMap);
    const defaultArrayValue = extractDataMapDefaultValues(platformDataMap);

    if (isVarTypeObject(platformDataMap.var_type)) {
        if (!platformDataMap.is_optional) {
            mappedPlatformElementAddChild(platformData);
        }
    } else if (
        platformDataMap.var_type === VarType.ARRAY_STRING ||
        platformDataMap.var_type === VarType.ARRAY_INT ||
        platformDataMap.var_type === VarType.ARRAY_FLOAT
    ) {
        if (defaultArrayValue !== null) {
            platformData.values = defaultArrayValue;
        } else if (!platformDataMap.is_optional) {
            platformData.values.push('');
        }
    } else if (platformDataMap.var_type === VarType.BOOLEAN) {
        platformData.values.push(defaultValue ?? !platformDataMap.is_optional ? false : '');
    } else {
        platformData.values.push(defaultValue ?? '');
    }
    return platformData;
};

const mappedPlatformElementAddChildWithValues = (
    platformData: MappedPlatformElement,
    dataMaps: DataMap[],
): void => {
    if (platformDataMapHasChildren(platformData.platformDataMap)) {
        platformData.children.push(
            (platformData.platformDataMap as any).child_platform_data_maps.map(
                (childPlatformDataMap: PlatformDataMap): MappedPlatformElement =>
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    mappedPlatformElementFromDataMapWithValues(
                        childPlatformDataMap,
                        dataMaps.find((dm) => dm.key === childPlatformDataMap.key) as DataMap,
                    ),
            ),
        );
    }
};

const mappedPlatformElementFromDataMapWithValues = (
    platformDataMap: PlatformDataMap,
    dataMap?: DataMap,
): MappedPlatformElement => {
    const platformData: MappedPlatformElement = {
        platformDataMap,
        errors: new Map<number, string>(),
        values: [],
        children: [],
    };

    if (platformDataMap.var_type === VarType.OBJECT) {
        if (dataMap?.value?.object) {
            mappedPlatformElementAddChildWithValues(platformData, dataMap.value.object);
        }
    } else if (platformDataMap.var_type === VarType.ARRAY_OBJECT) {
        if (dataMap?.value?.objects) {
            dataMap.value.objects.map((_) =>
                mappedPlatformElementAddChildWithValues(platformData, _),
            );
        }
    } else if (
        platformDataMap.var_type === VarType.ARRAY_STRING ||
        platformDataMap.var_type === VarType.ARRAY_INT ||
        platformDataMap.var_type === VarType.ARRAY_FLOAT
    ) {
        if (dataMap?.value?.values) {
            dataMap.value.values.map((_) => platformData.values.push(_));
        }
    } else {
        platformData.values.push(dataMap?.value?.value ?? '');
    }
    return platformData;
};

export {
    findNestedPlatformElementAndChange,
    mappedPlatformElementToDataMapInput,
    mappedPlatformElementFromDataMap,
    mappedPlatformElementFromDataMapWithValues,
    mappedPlatformElementAddChild,
    mappedPlatformElementAddChildWithValues,
    extractDataMapDefaultValue,
    extractDataMapDefaultValues,
};
