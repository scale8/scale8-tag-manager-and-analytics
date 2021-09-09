import DataMap from '../mongo/models/tag/DataMap';
import PlatformDataMap from '../mongo/models/tag/PlatformDataMap';
import RepeatedDataMap from '../mongo/models/tag/RepeatedDataMap';
import S8VarTypeValidation from '../core/S8VarTypeValidation';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import { DataMapSchema, DataMapSchemaCheck } from '../mongo/types/Types';
import IngestEndpointEnvironment from '../mongo/models/data/IngestEndpointEnvironment';
import { ObjectID } from 'mongodb';
import userMessages from '../errors/UserMessages';
import S8DateTime from '../core/S8DateTime';
import ScalarContainer from '../mongo/custom/ScalarContainer';
import GQLError from '../errors/GQLError';
import User from '../mongo/models/User';
import Revision from '../mongo/models/tag/Revision';
import { VarType } from '../enums/VarType';
import { InputType } from '../../../common/enums/InputType';
import { DataMapValue } from '../../../common/types/Types';

export type DataMapInput = {
    key: string;
    var_type: VarType;
    value?: DataMapValue;
    values?: DataMapValue[];
    children?: DataMapInput[];
    repeated_children?: DataMapInput[][];
};

export const dataMapsImplementPlatformDataMaps = async (
    dataMaps: DataMap[],
    platformDataMaps: PlatformDataMap[],
    allowCustom = false,
): Promise<string[]> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const checkCustom = (): string[] =>
        allowCustom
            ? []
            : dataMaps
                  .map((dataMap) => {
                      const existsInSpec = platformDataMaps.find((_) => _.key == dataMap.key);
                      return existsInSpec === undefined
                          ? `${dataMap.key} does not exist in specification`
                          : null;
                  })
                  .filter((_): _ is string => _ != null);

    return (
        await Promise.all(
            platformDataMaps.map(async (platformDataMap): Promise<string[]> => {
                //if every platform data map has been correctly implemented top down, we are good to go...
                const implementation = dataMaps.find((_) => _.key == platformDataMap.key);
                if (implementation === undefined) {
                    return platformDataMap.isOptional
                        ? []
                        : [`${platformDataMap.key} has not been implemented`];
                } else if (
                    platformDataMap.varType === VarType.OBJECT &&
                    implementation.varType === VarType.OBJECT
                ) {
                    //this data map should have children (as we have attempted to implement it), so compare...
                    return await dataMapsImplementPlatformDataMaps(
                        await repoFactory(DataMap).findByIds(implementation.childDataMapIds),
                        await repoFactory(PlatformDataMap).findByIds(
                            platformDataMap.childPlatformDataMapIds,
                        ),
                    );
                } else if (
                    platformDataMap.varType === VarType.ARRAY_OBJECT &&
                    implementation.varType === VarType.ARRAY_OBJECT
                ) {
                    const repeatedDataMaps = await repoFactory(RepeatedDataMap).findByIds(
                        implementation.repeatedDataMapIds,
                    );
                    return (
                        await Promise.all(
                            repeatedDataMaps.map(async (repeatedDataMap) => {
                                //each of these should repeat against the platform child data maps...
                                return await dataMapsImplementPlatformDataMaps(
                                    await repoFactory(DataMap).findByIds(
                                        repeatedDataMap.repeatedChildDataMapIds,
                                    ),
                                    await repoFactory(PlatformDataMap).findByIds(
                                        platformDataMap.childPlatformDataMapIds,
                                    ),
                                );
                            }),
                        )
                    ).flat();
                } else {
                    //this data map should have implemented the correct type on platform action...
                    return S8VarTypeValidation.valueTypesMatch(
                        platformDataMap.varType,
                        implementation.value,
                    )
                        ? []
                        : [
                              `${platformDataMap.key} has the wrong, or unsupported value attributed to it, expecting ${platformDataMap.varType}`,
                          ];
                }
            }),
        )
    )
        .flat()
        .concat(checkCustom());
};

const dataMapSchemaImplementsPlatformDataMap = async (
    platformDataMap: PlatformDataMap,
    dataMapSchema?: DataMapSchema,
): Promise<DataMapSchemaCheck[]> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const validateInputType = async (
        inputType: InputType,
        varType: VarType,
        value: any,
    ): Promise<DataMapSchemaCheck> => {
        if (inputType === InputType.INGEST_ENDPOINT_PAYLOAD_DESIGNER) {
            try {
                const data = JSON.parse(value);
                if (
                    typeof data === 'object' &&
                    !Array.isArray(data) &&
                    typeof data.ingest_environment_id === 'string' &&
                    typeof data.payload === 'object' &&
                    !Array.isArray(data.payload)
                ) {
                    const ingestEndpoint = await repoFactory(
                        IngestEndpointEnvironment,
                    ).findByIdThrows(
                        new ObjectID(data.ingest_environment_id),
                        userMessages.ingestEndpointFailed,
                    );
                    return {
                        platform_data_map_id: platformDataMap.id,
                        model_links: [
                            {
                                name: ingestEndpoint.constructor.name,
                                id: ingestEndpoint.id,
                            },
                        ],
                        valid: true,
                    };
                } else {
                    return {
                        platform_data_map_id: platformDataMap.id,
                        issue: `Unexpected value provided, expecting a JSON encoded object`,
                        valid: false,
                    };
                }
            } catch (e) {
                return {
                    platform_data_map_id: platformDataMap.id,
                    issue: `Unexpected value provided`,
                    valid: false,
                };
            }
        } else {
            return {
                platform_data_map_id: platformDataMap.id,
                valid: true,
            };
        }
    };

    if (dataMapSchema === undefined) {
        if (platformDataMap.isOptional) {
            //it can be left undefined
            return [
                {
                    platform_data_map_id: platformDataMap.id,
                    valid: true,
                },
            ];
        } else {
            return [
                {
                    platform_data_map_id: platformDataMap.id,
                    valid: false,
                    issue: `Missing required property ${platformDataMap.key}`,
                },
            ];
        }
    } else {
        if (dataMapSchema.key === platformDataMap.key) {
            //keys match up, so continue...
            if (
                platformDataMap.varType === VarType.STRING &&
                typeof dataMapSchema.value === 'string'
            ) {
                return [
                    await validateInputType(
                        platformDataMap.inputType,
                        platformDataMap.varType,
                        dataMapSchema.value,
                    ),
                ];
            } else if (
                platformDataMap.varType === VarType.INT &&
                typeof dataMapSchema.value === 'number' &&
                Number.isInteger(dataMapSchema.value)
            ) {
                return [
                    await validateInputType(
                        platformDataMap.inputType,
                        platformDataMap.varType,
                        dataMapSchema.value,
                    ),
                ];
            } else if (
                platformDataMap.varType === VarType.FLOAT &&
                typeof dataMapSchema.value === 'number'
            ) {
                return [
                    await validateInputType(
                        platformDataMap.inputType,
                        platformDataMap.varType,
                        dataMapSchema.value,
                    ),
                ];
            } else if (
                platformDataMap.varType === VarType.BOOLEAN &&
                typeof dataMapSchema.value === 'boolean'
            ) {
                return [
                    await validateInputType(
                        platformDataMap.inputType,
                        platformDataMap.varType,
                        dataMapSchema.value,
                    ),
                ];
            } else if (
                platformDataMap.varType === VarType.TIMESTAMP &&
                typeof dataMapSchema.value === 'number' &&
                S8DateTime.isValidTimestamp(dataMapSchema.value)
            ) {
                return [
                    await validateInputType(
                        platformDataMap.inputType,
                        platformDataMap.varType,
                        dataMapSchema.value,
                    ),
                ];
            } else if (
                platformDataMap.varType === VarType.DATETIME &&
                typeof dataMapSchema.value === 'string' &&
                S8DateTime.isValidDateTime(dataMapSchema.value)
            ) {
                return [
                    await validateInputType(
                        platformDataMap.inputType,
                        platformDataMap.varType,
                        dataMapSchema.value,
                    ),
                ];
            } else if (
                platformDataMap.varType === VarType.ARRAY_STRING &&
                dataMapSchema.value instanceof ScalarContainer &&
                dataMapSchema.value.arr.every((_) => typeof _ === 'string')
            ) {
                return [
                    await validateInputType(
                        platformDataMap.inputType,
                        platformDataMap.varType,
                        dataMapSchema.value,
                    ),
                ];
            } else if (
                platformDataMap.varType === VarType.ARRAY_INT &&
                dataMapSchema.value instanceof ScalarContainer &&
                dataMapSchema.value.arr.every((_) => typeof _ === 'number' && Number.isInteger(_))
            ) {
                return [
                    await validateInputType(
                        platformDataMap.inputType,
                        platformDataMap.varType,
                        dataMapSchema.value,
                    ),
                ];
            } else if (
                platformDataMap.varType === VarType.ARRAY_FLOAT &&
                dataMapSchema.value instanceof ScalarContainer &&
                dataMapSchema.value.arr.every((_) => typeof _ === 'number')
            ) {
                return [
                    await validateInputType(
                        platformDataMap.inputType,
                        platformDataMap.varType,
                        dataMapSchema.value,
                    ),
                ];
            } else if (platformDataMap.varType === VarType.ARRAY_OBJECT) {
                //our data map schema must be an array of an array
                if (
                    Array.isArray(dataMapSchema.value) &&
                    (dataMapSchema.value as any[]).every((_) => Array.isArray(_))
                ) {
                    const childMaps = await repoFactory(PlatformDataMap).findByIds(
                        platformDataMap.childPlatformDataMapIds,
                    );
                    //child maps here are a repeated pattern...
                    return (
                        await Promise.all(
                            (dataMapSchema.value as DataMapSchema[][]).map(async (schemas) => {
                                //every set of children must be re-tested here...
                                return (
                                    await Promise.all(
                                        childMaps.map((childMap) => {
                                            //we need to locate
                                            return dataMapSchemaImplementsPlatformDataMap(
                                                childMap,
                                                schemas.find((_) => _.key === childMap.key),
                                            );
                                        }),
                                    )
                                ).flat();
                            }),
                        )
                    ).flat();
                } else {
                    throw new GQLError(
                        userMessages.dataMapArrayExpected(platformDataMap.key),
                        true,
                    );
                }
            } else if (platformDataMap.varType === VarType.OBJECT) {
                //our data map schema must be an array...
                if (
                    Array.isArray(dataMapSchema.value) &&
                    (dataMapSchema.value as any[]).every((_) => !Array.isArray(_))
                ) {
                    //we are expecting an object...
                    const childMaps = await repoFactory(PlatformDataMap).findByIds(
                        platformDataMap.childPlatformDataMapIds,
                    );
                    return (
                        await Promise.all(
                            childMaps.map((childMap) =>
                                dataMapSchemaImplementsPlatformDataMap(
                                    childMap,
                                    (dataMapSchema.value as DataMapSchema[]).find(
                                        (_) => _.key === childMap.key,
                                    ),
                                ),
                            ),
                        )
                    ).flat();
                } else {
                    return [
                        {
                            platform_data_map_id: platformDataMap.id,
                            valid: false,
                            issue: `Expecting ${platformDataMap.key} to be an array`,
                        },
                    ];
                }
            } else {
                return [
                    {
                        platform_data_map_id: platformDataMap.id,
                        valid: false,
                        issue: `Unsupported var type ${platformDataMap.varType} provided for ${platformDataMap.key}`,
                    },
                ];
            }
        } else {
            return [
                {
                    platform_data_map_id: platformDataMap.id,
                    valid: false,
                    issue: `Failed to match data input key ${dataMapSchema.key} with platform data map key ${platformDataMap.key}`,
                },
            ];
        }
    }
};

export const dataMapSchemasImplementsPlatformDataMaps = async (
    platformDataMaps: PlatformDataMap[],
    dataMapSchemas: DataMapSchema[],
): Promise<DataMapSchemaCheck[]> => {
    return (
        await Promise.all(
            platformDataMaps.map(
                async (platformDataMap) =>
                    await dataMapSchemaImplementsPlatformDataMap(
                        platformDataMap,
                        dataMapSchemas.find((_) => _.key === platformDataMap.key),
                    ),
            ),
        )
    ).flat();
};

export const createDataMapSchemasFromDataMapInput = (
    dataMapInputs: DataMapInput[],
): DataMapSchema[] => {
    const getDataMapSchema = (dataMapInput: DataMapInput): DataMapSchema => {
        if (dataMapInput.value !== undefined && dataMapInput.value !== null) {
            return {
                key: dataMapInput.key,
                varType: dataMapInput.var_type,
                value: dataMapInput.value,
            };
        } else if (Array.isArray(dataMapInput.values)) {
            return {
                key: dataMapInput.key,
                varType: dataMapInput.var_type,
                value: new ScalarContainer(...dataMapInput.values),
            };
        } else if (Array.isArray(dataMapInput.children)) {
            return {
                key: dataMapInput.key,
                varType: VarType.OBJECT, //force this..
                value: dataMapInput.children.map((_) => getDataMapSchema(_)),
            };
        } else if (Array.isArray(dataMapInput.repeated_children)) {
            return {
                key: dataMapInput.key,
                varType: VarType.ARRAY_OBJECT, //force this..
                value: dataMapInput.repeated_children.map((dataMapInputs) =>
                    dataMapInputs.map((_) => getDataMapSchema(_)),
                ),
            };
        } else {
            throw new GQLError(userMessages.dmSchemaDefinitionIssue, true);
        }
    };
    return dataMapInputs.map((_) => getDataMapSchema(_));
};

export const createDataMapsFromSchemas = async (
    actor: User,
    dataMapSchemas: DataMapSchema[],
    revision: Revision,
): Promise<DataMap[]> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    const filterDuplicates = (v: DataMapSchema, i: number, s: DataMapSchema[]): boolean =>
        s.findIndex((_) => _.key == v.key) === i;
    const createDataMap = async (schema: DataMapSchema): Promise<DataMap> => {
        const createValue = async (
            key: string,
            schemaValue:
                | DataMapValue
                | ScalarContainer<DataMapValue>
                | DataMapSchema[]
                | DataMapSchema[][],
        ): Promise<
            DataMapValue | ScalarContainer<DataMapValue> | DataMap[] | RepeatedDataMap[]
        > => {
            if (
                typeof schemaValue === 'string' ||
                typeof schemaValue === 'number' ||
                typeof schemaValue === 'boolean'
            ) {
                return schemaValue;
            } else if (schemaValue instanceof ScalarContainer) {
                return schemaValue;
            } else if (
                Array.isArray(schemaValue) &&
                (schemaValue as any[]).every((_) => Array.isArray(_))
            ) {
                //must have DataMapSchema[][]
                return await Promise.all(
                    (schemaValue as DataMapSchema[][]).map(async (_) => {
                        return await repoFactory(RepeatedDataMap).save(
                            new RepeatedDataMap(
                                `Repeated container for '${key}'`,
                                revision,
                                await Promise.all(
                                    _.filter(filterDuplicates).map((_) => createDataMap(_)),
                                ),
                            ),
                            actor,
                        );
                    }),
                );
            } else {
                //we have to construct this from DataMapSchema[]
                return Promise.all(
                    (schemaValue as DataMapSchema[])
                        .filter(filterDuplicates)
                        .map((_) => createDataMap(_)),
                );
            }
        };
        return await repoFactory(DataMap).save(
            new DataMap(
                schema.key,
                schema.varType,
                revision,
                await createValue(schema.key, schema.value),
            ),
            actor,
        );
    };
    return Promise.all(dataMapSchemas.filter(filterDuplicates).map((_) => createDataMap(_)));
};
