import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { VarType } from '../../gql/generated/globalTypes';
import { DataMapsTabularEdit } from '../molecules/DataMapsTabularEdit';
import { IngestEndpointDataMap } from '../../types/IngestEndpointsTypes';
import { AppPlatformRevision } from '../../types/TagRulesTypes';
import { DataMapsPayloadValues } from '../../types/DataMapsTypes';
import {
    isValueFromPlatform,
    isVarTypeArray,
    isVarTypeObject,
    isVarTypeScalar,
} from '../../utils/VarTypeUtils';

const buildKeyPath = (key: string, parentKey: string | null, parentIndex: number): string => {
    if (parentKey === null) {
        return key;
    }
    return `${parentKey}${parentIndex !== -1 ? `.${parentIndex}` : ''}.${key}`;
};

const buildDataMapsPayloadValues = (
    dataMaps: IngestEndpointDataMap[],
    parentKey: string | null = null,
    parentIndex = -1,
    payload: DataMapsPayload = null,
): DataMapsPayloadValues[] => {
    return dataMaps.map((dataMap) =>
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        initDataMapPayloadValue(dataMap, parentKey, parentIndex, payload),
    );
};

const valuesFromPayload = (
    key: string,
    varType: VarType,
    payload: DataMapsPayload,
): S8DataMapValue[] | null => {
    if (payload === null || !payload.hasOwnProperty(key) || payload[key] === undefined) {
        return null;
    }

    if (isVarTypeScalar(varType) && isValueFromPlatform(payload[key] as S8DataMapValue)) {
        return [payload[key] as string];
    }

    if (varType === VarType.STRING || varType === VarType.DATETIME) {
        if (typeof payload[key] === 'string') {
            return [payload[key] as string];
        }
    }

    if (varType === VarType.BOOLEAN) {
        if (typeof payload[key] === 'boolean') {
            return [payload[key] as boolean];
        }
    }

    if (varType === VarType.INT || varType === VarType.FLOAT || varType === VarType.TIMESTAMP) {
        if (typeof payload[key] === 'number') {
            return [payload[key] as number];
        }
    }

    if (isVarTypeArray(varType)) {
        return payload[key] as S8DataMapValue[];
    }

    return null;
};

const objectsFromPayload = (
    keyPath: string,
    dataMap: IngestEndpointDataMap,
    payload: DataMapsPayload,
): { children: DataMapsPayloadValues[] }[] | null => {
    const { key, var_type: varType } = dataMap;

    if (payload === null || !payload.hasOwnProperty(key) || payload[key] === undefined) {
        return null;
    }

    if (varType === VarType.OBJECT) {
        if (typeof payload[key] === 'object') {
            return [
                {
                    children: buildDataMapsPayloadValues(
                        dataMap.child_ingest_endpoint_data_maps,
                        keyPath,
                        dataMap.var_type === VarType.ARRAY_OBJECT ? 0 : -1,
                        payload[key] as DataMapsPayload,
                    ),
                },
            ];
        }
    }

    if (varType === VarType.ARRAY_OBJECT) {
        if (Array.isArray(payload[key])) {
            return (payload[key] as DataMapsPayload[]).map((currentPayload) => ({
                children: buildDataMapsPayloadValues(
                    dataMap.child_ingest_endpoint_data_maps,
                    keyPath,
                    dataMap.var_type === VarType.ARRAY_OBJECT ? 0 : -1,
                    currentPayload,
                ),
            }));
        }
    }

    return null;
};

const initDataMapPayloadValue = (
    dataMap: IngestEndpointDataMap,
    parentKey: string | null,
    parentIndex: number, // -1 = not in object array
    payload: DataMapsPayload = null,
): DataMapsPayloadValues => {
    const keyPath = buildKeyPath(dataMap.key, parentKey, parentIndex);

    if (isVarTypeObject(dataMap.var_type)) {
        const payloadObjects = objectsFromPayload(keyPath, dataMap, payload);
        return {
            dataMap,
            parentKey,
            parentIndex,
            include: !dataMap.is_optional || payloadObjects !== null,
            keyPath,
            values: [],
            objects: payloadObjects ?? [
                {
                    children: buildDataMapsPayloadValues(
                        dataMap.child_ingest_endpoint_data_maps,
                        keyPath,
                        dataMap.var_type === VarType.ARRAY_OBJECT ? 0 : -1,
                    ),
                },
            ],
        };
    } else {
        const payloadValues = valuesFromPayload(dataMap.key, dataMap.var_type, payload);
        return {
            dataMap,
            parentKey,
            parentIndex,
            include:
                (dataMap.default_value === null && !dataMap.is_optional) || payloadValues !== null,
            keyPath,
            values: payloadValues ?? [''],
            objects: [],
        };
    }
};

export type DataMapsPayload = Record<string, unknown> | null;

const isPayloadValueScalar = (v: DataMapsPayloadValues): boolean => {
    return isVarTypeScalar(v.dataMap.var_type);
};

const isPayloadValueArray = (v: DataMapsPayloadValues): boolean => {
    return isVarTypeArray(v.dataMap.var_type);
};

const dataMapsPayloadValuesToPayload = (
    dataMapsPayloadValues: DataMapsPayloadValues[],
): DataMapsPayload => {
    return dataMapsPayloadValues.reduce(
        (accumulator: DataMapsPayload, current: DataMapsPayloadValues) => {
            return {
                ...accumulator,
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                [current.dataMap.key]: extractPayloadValues(current),
            } as DataMapsPayload;
        },
        {},
    );
};

const extractPayloadValues = (v: DataMapsPayloadValues) => {
    if (!v.include) return undefined;

    if (v.values.some((_) => _ === '')) {
        throw new Error('Missing required value');
    }

    if (isPayloadValueScalar(v)) {
        return v.values[0];
    }

    if (isPayloadValueArray(v)) {
        return v.values;
    }

    if (v.dataMap.var_type === VarType.OBJECT) {
        return dataMapsPayloadValuesToPayload(v.objects[0].children);
    }

    if (v.dataMap.var_type === VarType.ARRAY_OBJECT) {
        return v.objects.map((_) => dataMapsPayloadValuesToPayload(_.children));
    }

    return undefined;
};

const dataMapsPayloadValuesToPayloadOrNull = (
    dataMapsPayloadValues: DataMapsPayloadValues[],
): DataMapsPayload => {
    try {
        return dataMapsPayloadValuesToPayload(dataMapsPayloadValues);
    } catch {
        return null;
    }
};

const setDataMapsPayloadValuesWithFunction = (
    dataMapsPayloadValues: DataMapsPayloadValues[],
    keyPath: string,
    valuesFunction: (oldValues: S8DataMapValue[]) => S8DataMapValue[],
): DataMapsPayloadValues[] => {
    return dataMapsPayloadValues.map((dataMapsPayloadValue) => {
        if (dataMapsPayloadValue.keyPath === keyPath) {
            return {
                ...dataMapsPayloadValue,
                values: valuesFunction(dataMapsPayloadValue.values),
            };
        }

        if (isVarTypeObject(dataMapsPayloadValue.dataMap.var_type)) {
            return {
                ...dataMapsPayloadValue,
                objects: dataMapsPayloadValue.objects.map((object) => ({
                    children: setDataMapsPayloadValuesWithFunction(
                        object.children,
                        keyPath,
                        valuesFunction,
                    ),
                })),
            };
        }

        return dataMapsPayloadValue;
    });
};

const setDataMapsPayloadObjectsWithFunction = (
    dataMapsPayloadValues: DataMapsPayloadValues[],
    keyPath: string,
    objectsFunction: (
        oldObjects: {
            children: DataMapsPayloadValues[];
        }[],
        dataMap: IngestEndpointDataMap,
        keyPath: string,
    ) => { children: DataMapsPayloadValues[] }[],
): DataMapsPayloadValues[] => {
    return dataMapsPayloadValues.map((dataMapsPayloadValue) => {
        if (dataMapsPayloadValue.keyPath === keyPath) {
            return {
                ...dataMapsPayloadValue,
                objects: objectsFunction(
                    dataMapsPayloadValue.objects,
                    dataMapsPayloadValue.dataMap,
                    keyPath,
                ),
            };
        }

        if (isVarTypeObject(dataMapsPayloadValue.dataMap.var_type)) {
            return {
                ...dataMapsPayloadValue,
                objects: dataMapsPayloadValue.objects.map((object) => ({
                    children: setDataMapsPayloadObjectsWithFunction(
                        object.children,
                        keyPath,
                        objectsFunction,
                    ),
                })),
            };
        }

        return dataMapsPayloadValue;
    });
};

const setDataMapsPayloadValueInclude = (
    dataMapsPayloadValues: DataMapsPayloadValues[],
    keyPath: string,
    include: boolean,
): DataMapsPayloadValues[] => {
    return dataMapsPayloadValues.map((dataMapsPayloadValue) => {
        if (dataMapsPayloadValue.keyPath === keyPath) {
            return {
                ...initDataMapPayloadValue(
                    dataMapsPayloadValue.dataMap,
                    dataMapsPayloadValue.parentKey,
                    dataMapsPayloadValue.parentIndex,
                ),
                include,
            };
        }

        if (isVarTypeObject(dataMapsPayloadValue.dataMap.var_type)) {
            return {
                ...dataMapsPayloadValue,
                objects: dataMapsPayloadValue.objects.map((object) => ({
                    children: setDataMapsPayloadValueInclude(object.children, keyPath, include),
                })),
            };
        }

        return dataMapsPayloadValue;
    });
};

export type DataMapsPayloadBuilderProps = {
    appPlatformRevisions?: AppPlatformRevision[];
    dataMapsPayloadValues: DataMapsPayloadValues[];
    setDataMapsPayloadValues: Dispatch<SetStateAction<DataMapsPayloadValues[]>>;
    dataMaps: IngestEndpointDataMap[];
    initialPayload: DataMapsPayload;
    setPayload: Dispatch<SetStateAction<DataMapsPayload>>;
    disabled: boolean;
};

const DataMapsPayloadBuilder: FC<DataMapsPayloadBuilderProps> = (
    props: DataMapsPayloadBuilderProps,
) => {
    const {
        dataMaps,
        setPayload,
        initialPayload,
        dataMapsPayloadValues,
        setDataMapsPayloadValues,
        disabled,
    } = props;

    useEffect(() => {
        // reset when datamaps changes
        setDataMapsPayloadValues(
            buildDataMapsPayloadValues(props.dataMaps, null, -1, initialPayload),
        );
    }, [dataMaps, setDataMapsPayloadValues]);

    useEffect(() => {
        // reset when datamaps changes
        setPayload(dataMapsPayloadValuesToPayloadOrNull(dataMapsPayloadValues));
    }, [dataMapsPayloadValues, setPayload]);

    const removeArrayElement = (keyPath: string, index: number): void => {
        setDataMapsPayloadValues(
            setDataMapsPayloadValuesWithFunction(
                dataMapsPayloadValues,
                keyPath,
                (oldValues: S8DataMapValue[]): S8DataMapValue[] =>
                    oldValues.filter((_, key) => key !== index),
            ),
        );
    };

    const addArrayElement = (keyPath: string): void => {
        setDataMapsPayloadValues(
            setDataMapsPayloadValuesWithFunction(
                dataMapsPayloadValues,
                keyPath,
                (oldValues: S8DataMapValue[]): S8DataMapValue[] => [...oldValues, ''],
            ),
        );
    };

    const removeObjectArrayElement = (keyPath: string, index: number): void => {
        setDataMapsPayloadValues(
            setDataMapsPayloadObjectsWithFunction(
                dataMapsPayloadValues,
                keyPath,
                (
                    oldObjects: { children: DataMapsPayloadValues[] }[],
                ): { children: DataMapsPayloadValues[] }[] =>
                    oldObjects.filter((_, key) => key !== index),
            ),
        );
    };

    const addObjectArrayElement = (keyPath: string): void => {
        setDataMapsPayloadValues(
            setDataMapsPayloadObjectsWithFunction(
                dataMapsPayloadValues,
                keyPath,
                (
                    oldObjects: { children: DataMapsPayloadValues[] }[],
                    dataMap: IngestEndpointDataMap,
                    keyPath: string,
                ): { children: DataMapsPayloadValues[] }[] => [
                    ...oldObjects,
                    {
                        children: buildDataMapsPayloadValues(
                            dataMap.child_ingest_endpoint_data_maps,
                            keyPath,
                            oldObjects.length,
                        ),
                    },
                ],
            ),
        );
    };

    const setValue = (keyPath: string, v: S8DataMapValue, index: number): void => {
        setDataMapsPayloadValues(
            setDataMapsPayloadValuesWithFunction(
                dataMapsPayloadValues,
                keyPath,
                (oldValues: S8DataMapValue[]): S8DataMapValue[] => {
                    return [...oldValues.slice(0, index), v, ...oldValues.slice(index + 1)];
                },
            ),
        );
    };

    const setInclude = (keyPath: string, include: boolean): void => {
        setDataMapsPayloadValues(
            setDataMapsPayloadValueInclude(dataMapsPayloadValues, keyPath, include),
        );
    };

    return (
        <DataMapsTabularEdit
            appPlatformRevisions={props.appPlatformRevisions}
            dataMapsPayloadValues={dataMapsPayloadValues}
            setValue={setValue}
            setInclude={setInclude}
            addArrayElement={addArrayElement}
            removeArrayElement={removeArrayElement}
            addObjectArrayElement={addObjectArrayElement}
            removeObjectArrayElement={removeObjectArrayElement}
            disabled={disabled}
        />
    );
};

export { DataMapsPayloadBuilder, buildDataMapsPayloadValues };
