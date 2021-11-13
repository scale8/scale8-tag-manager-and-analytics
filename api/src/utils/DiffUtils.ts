import PlatformRevision from '../mongo/models/tag/PlatformRevision';
import Revision from '../mongo/models/tag/Revision';
import IngestEndpointRevision from '../mongo/models/data/IngestEndpointRevision';
import {
    CT,
    GQLScalar,
    JSONSafeDiff,
    ModelDiff,
    ModelDiffProp,
    ModelType,
} from '../mongo/types/Types';
import userMessages from '../errors/UserMessages';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import Model from '../mongo/abstractions/Model';
import DiffError from '../errors/DiffError';
import ScalarContainer from '../mongo/custom/ScalarContainer';
import { ObjectId } from 'mongodb';
import { RCT } from '../container/ChainDependenciesBinder';
import Repo from '../mongo/abstractions/Repo';
import DiffState from '../enums/DiffState';
import FieldProps from '../mongo/interfaces/FieldProps';
import RepoFromRepoNameFactory from '../container/factoryTypes/RepoFromRepoNameFactory';

const modelDiff = async (
    left: Model | undefined,
    right: Model | undefined,
): Promise<ModelDiff[]> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const repoFromNameFactory = container.get<RepoFromRepoNameFactory>(
        TYPES.RepoFromRepoNameFactory,
    );

    const getDetails = (): { name: string; id: string; ref: Model } => {
        if (left === undefined && right !== undefined) {
            return {
                name: right.constructor.name,
                id: right._persisting_id,
                ref: right,
            };
        } else if (right === undefined && left !== undefined) {
            return {
                name: left.constructor.name,
                id: left._persisting_id,
                ref: left,
            };
        } else if (
            right !== undefined &&
            left !== undefined &&
            left.constructor.name === right.constructor.name &&
            left._persisting_id === right._persisting_id
        ) {
            return {
                name: right.constructor.name,
                id: right._persisting_id,
                ref: right,
            };
        } else {
            // Hide message in production
            throw new DiffError(
                'Unable to perform diff as models are not comparable',
                userMessages.diffFailed,
            );
        }
    };

    const details = getDetails();
    const commonModelName = details.name;
    const persistedId = details.id;
    const mapping = repoFactory(commonModelName).getMapping(details.ref);

    const isValidScalar = (value: ModelType): boolean => {
        return (
            value instanceof ScalarContainer ||
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean' ||
            value === null ||
            value instanceof Date
        );
    };

    const toGQLValue = (value: ModelType): GQLScalar | GQLScalar[] => {
        if (value === null) {
            return null;
        }
        if (value instanceof ScalarContainer) {
            return value.arr;
        } else if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
        ) {
            return value;
        } else if (value instanceof Date) {
            return new Date(value.getTime());
        } else if (value instanceof ObjectId) {
            return value.toString();
        } else if (Array.isArray(value) && (value as any[]).every((_) => _ instanceof ObjectId)) {
            return (value as ObjectId[]).map((_) => _.toString());
        } else {
            // Hide message in production
            throw new DiffError('Unable to covert value to GQL value', userMessages.diffFailed);
        }
    };

    const getInstance = async (
        value: ObjectId | null,
        repository: RCT<Repo<Model>> | undefined,
    ): Promise<Model | null> => {
        if (value === null) {
            return null;
        } else if (repository === undefined) {
            // Hide message in production
            throw new DiffError(
                'Unable to determine new instance for building object',
                userMessages.diffFailed,
            );
        } else {
            return await repoFromNameFactory(repository.name).findOne({
                _id: value,
            });
        }
    };

    const getInstances = async (
        key: string,
        values: ObjectId[] | null,
        repository: RCT<Repo<Model>> | undefined,
    ): Promise<Model[]> => {
        if (values === null) {
            return [];
        } else if (repository === undefined) {
            // Hide message in production
            throw new DiffError(
                `Unable to determine new instance on '${key}' for building objects`,
                userMessages.diffFailed,
            );
        } else {
            return repoFromNameFactory(repository.name).findByIds(values);
        }
    };

    const getValueAsModelType = (model: Model | undefined, key: string): ModelType => {
        return model === undefined
            ? null
            : (model as any)[key] === undefined
            ? null
            : ((model as any)[key] as ModelType);
    };

    const getDiffState = (
        leftItem: GQLScalar | GQLScalar[],
        rightItem: GQLScalar | GQLScalar[],
    ): DiffState => {
        if (leftItem === null && rightItem !== null) {
            return DiffState.ADDED;
        } else if (leftItem !== null && rightItem === null) {
            return DiffState.DELETED;
        } else if (leftItem !== null && rightItem !== null) {
            if (Array.isArray(leftItem) && !Array.isArray(rightItem)) {
                return DiffState.MODIFIED;
            } else if (Array.isArray(rightItem) && !Array.isArray(leftItem)) {
                return DiffState.MODIFIED;
            } else if (Array.isArray(leftItem) && Array.isArray(rightItem)) {
                if (leftItem.length === rightItem.length) {
                    //we need to compare, for now do a like for like positional check...
                    return leftItem.every(
                        (v, i) => getDiffState(v, rightItem[i]) === DiffState.NONE,
                    )
                        ? DiffState.NONE
                        : DiffState.MODIFIED;
                } else {
                    return DiffState.MODIFIED;
                }
            } else if (leftItem instanceof Date && rightItem instanceof Date) {
                //can't use toString to compare dates...
                return leftItem.getTime() === rightItem.getTime()
                    ? DiffState.NONE
                    : DiffState.MODIFIED;
            } else {
                return leftItem.toString() === rightItem.toString()
                    ? DiffState.NONE
                    : DiffState.MODIFIED;
            }
        } else {
            return DiffState.NONE; //left and right must be both null.
        }
    };

    const getPlatformInstance = (
        testValue: ModelType,
        platformInstance?: (value: ModelType) => CT<Model> | null,
    ): CT<Model> | null => {
        if (!(testValue instanceof ObjectId)) {
            return null;
        } else if (platformInstance === undefined) {
            return null;
        } else {
            const modelOf = platformInstance(testValue);
            if (modelOf === null) {
                return null;
            } else {
                return modelOf;
            }
        }
    };

    const getProps = async (
        left: Model | undefined,
        right: Model | undefined,
    ): Promise<{ diffProp: ModelDiffProp; extraDiffs: ModelDiff[] }[]> => {
        return await Promise.all(
            Array.from(mapping.keys())
                .filter((key) => {
                    const props = mapping.get(key) as FieldProps<ModelType>;
                    return props.exposeToGQLAs !== undefined;
                })
                .map(async (key): Promise<{ diffProp: ModelDiffProp; extraDiffs: ModelDiff[] }> => {
                    //map this out to its new value...
                    const props = mapping.get(key) as FieldProps<ModelType>;
                    const gqlName = props.exposeToGQLAs || key;
                    const leftValue = getValueAsModelType(left, key);
                    const rightValue = getValueAsModelType(right, key);

                    if (isValidScalar(leftValue) && isValidScalar(rightValue)) {
                        const leftGQLValue = toGQLValue(leftValue);
                        const rightGQLValue = toGQLValue(rightValue);
                        return {
                            diffProp: {
                                field: key,
                                gqlField: gqlName,
                                left: leftGQLValue,
                                leftPlatformInstance: null,
                                right: rightGQLValue,
                                rightPlatformInstance: null,
                                state: getDiffState(leftGQLValue, rightGQLValue),
                                ref: false,
                                allowPlatformAutoMerge: props.platformAutoMerge === true,
                            },
                            extraDiffs: [],
                        };
                    } else if (leftValue instanceof ObjectId || rightValue instanceof ObjectId) {
                        if (props.repository === undefined) {
                            //we are just comparing id strings and not doing a diff on underlying objects
                            const leftGQLValue = toGQLValue(leftValue);
                            const rightGQLValue = toGQLValue(rightValue);
                            return {
                                diffProp: {
                                    field: key,
                                    gqlField: gqlName,
                                    left: leftGQLValue,
                                    leftPlatformInstance: getPlatformInstance(
                                        leftValue,
                                        props.platformInstance,
                                    ),
                                    right: rightGQLValue,
                                    rightPlatformInstance: getPlatformInstance(
                                        rightValue,
                                        props.platformInstance,
                                    ),
                                    state: getDiffState(leftGQLValue, rightGQLValue),
                                    ref: false,
                                    allowPlatformAutoMerge: props.platformAutoMerge === true,
                                },
                                extraDiffs: [],
                            };
                        } else {
                            //we have to fetch this from incoming model repo...
                            const lModel = await getInstance(
                                leftValue instanceof ObjectId ? leftValue : null,
                                props.repository,
                            );
                            const rModel = await getInstance(
                                rightValue instanceof ObjectId ? rightValue : null,
                                props.repository,
                            );

                            const doDiff = async (): Promise<ModelDiff[]> => {
                                if (lModel === null && rModel !== null) {
                                    return await modelDiff(undefined, rModel);
                                } else if (rModel === null && lModel !== null) {
                                    return await modelDiff(lModel, undefined);
                                } else if (lModel !== null && rModel !== null) {
                                    if (rModel._persisting_id === lModel._persisting_id) {
                                        //models are the same and can be compared...
                                        return await modelDiff(lModel, rModel);
                                    } else {
                                        //models are different, so generate diff on each side
                                        return [
                                            ...(await modelDiff(lModel, undefined)),
                                            ...(await modelDiff(undefined, rModel)),
                                        ];
                                    }
                                } else {
                                    // Hide message in production
                                    throw new DiffError(
                                        'Missing element in the database?',
                                        userMessages.diffFailed,
                                    );
                                }
                            };

                            return {
                                diffProp: {
                                    field: key,
                                    gqlField: gqlName,
                                    left: lModel === null ? null : lModel._persisting_id,
                                    leftPlatformInstance: null,
                                    right: rModel === null ? null : rModel._persisting_id,
                                    rightPlatformInstance: null,
                                    state: DiffState.NONE,
                                    ref: true,
                                    allowPlatformAutoMerge: props.platformAutoMerge === true,
                                },
                                extraDiffs: await doDiff(),
                            };
                        }
                    } else if (
                        (Array.isArray(leftValue) &&
                            (leftValue as any[]).every((v) => v instanceof ObjectId)) ||
                        (Array.isArray(rightValue) &&
                            (rightValue as any[]).every((v) => v instanceof ObjectId))
                    ) {
                        if (props.repository === undefined) {
                            const leftGQLValue = toGQLValue(leftValue);
                            const rightGQLValue = toGQLValue(rightValue);

                            return {
                                diffProp: {
                                    field: key,
                                    gqlField: gqlName,
                                    left: leftGQLValue,
                                    leftPlatformInstance: null,
                                    right: rightGQLValue,
                                    rightPlatformInstance: null,
                                    state: getDiffState(leftGQLValue, rightGQLValue),
                                    ref: false,
                                    allowPlatformAutoMerge: props.platformAutoMerge === true,
                                },
                                extraDiffs: [],
                            };
                        } else {
                            const lModels = await getInstances(
                                key,
                                leftValue as ObjectId[] | null,
                                props.repository,
                            );
                            const rModels = await getInstances(
                                key,
                                rightValue as ObjectId[] | null,
                                props.repository,
                            );
                            const persistenceMap: Map<
                                string,
                                {
                                    left: Model | undefined;
                                    right: Model | undefined;
                                }
                            > = new Map(
                                lModels.map((m) => [
                                    m._persisting_id,
                                    { left: m, right: undefined },
                                ]),
                            );
                            rModels.forEach((m) => {
                                const item = persistenceMap.get(m._persisting_id);
                                if (item === undefined) {
                                    persistenceMap.set(m._persisting_id, {
                                        left: undefined,
                                        right: m,
                                    });
                                } else {
                                    persistenceMap.set(m._persisting_id, {
                                        left: item.left,
                                        right: m,
                                    });
                                }
                            });

                            const doDiff = async (): Promise<ModelDiff[]> => {
                                return (
                                    await Promise.all(
                                        Array.from(persistenceMap.values()).map(async (item) => {
                                            return await modelDiff(item.left, item.right);
                                        }),
                                    )
                                ).flat();
                            };

                            return {
                                diffProp: {
                                    field: key,
                                    gqlField: gqlName,
                                    left: lModels.map((m) => m._persisting_id),
                                    leftPlatformInstance: null,
                                    right: rModels.map((m) => m._persisting_id),
                                    rightPlatformInstance: null,
                                    state: DiffState.NONE,
                                    ref: true,
                                    allowPlatformAutoMerge: props.platformAutoMerge === true,
                                },
                                extraDiffs: await doDiff(),
                            };
                        }
                    } else {
                        // Hide message in production
                        throw new DiffError(
                            `Unsupported diff value on ${key}`,
                            userMessages.diffFailed,
                        );
                    }
                }),
        );
    };

    const determineModelAlignment = (
        modelName: string,
        leftModel: Model | undefined,
        rightModel: Model | undefined,
        diffProps: ModelDiffProp[],
    ): DiffState => {
        if (leftModel === undefined) {
            return DiffState.ADDED;
        } else if (rightModel === undefined) {
            return DiffState.DELETED;
        } else {
            return diffProps.filter((_) => !_.ref).every((_) => _.state === DiffState.NONE)
                ? DiffState.NONE
                : DiffState.MODIFIED;
        }
    };

    const structProps = await getProps(left, right);

    const diffProps = structProps
        .map((v) => v.diffProp)
        .filter(
            (_) =>
                !_.field.match(
                    /^_(id|created_at|updated_at|persisting_id|revision_id|parent_revision_id|_clone_maps)$/,
                ),
        );
    return [
        {
            model: commonModelName,
            id: persistedId,
            left: left === undefined ? null : left,
            right: right === undefined ? null : right,
            state: determineModelAlignment(commonModelName, left, right, diffProps),
            props: diffProps,
            childrenModified: !structProps.every((v) =>
                v.extraDiffs.every((_) => _.state === DiffState.NONE),
            ),
        },
        ...structProps.map((v) => v.extraDiffs).flat(),
    ];
};

export const diff = async <U extends PlatformRevision | Revision | IngestEndpointRevision>(
    left: U | undefined,
    right: U | undefined,
): Promise<ModelDiff[]> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    //get new copies of left and right... why? because JavaScript ...
    return modelDiff(
        left === undefined
            ? undefined
            : await repoFactory(left.constructor.name).findByIdThrows(
                  left.id,
                  userMessages.diffFailed,
              ),
        right === undefined
            ? undefined
            : await repoFactory(right.constructor.name).findByIdThrows(
                  right.id,
                  userMessages.diffFailed,
              ),
    );
};

export const revisionsJSONSafeDiff = async <
    U extends PlatformRevision | Revision | IngestEndpointRevision,
>(
    left: U | undefined,
    right: U | undefined,
): Promise<JSONSafeDiff[]> => {
    const toBoxFromProp = (gqlValue: GQLScalar | GQLScalar[]): Record<string, unknown> | null => {
        if (Array.isArray(gqlValue) && gqlValue.length < 1) {
            return { ea: true };
        } else if (Array.isArray(gqlValue) && gqlValue.every((_) => typeof _ === 'string')) {
            return { sa: gqlValue };
        } else if (
            Array.isArray(gqlValue) &&
            gqlValue.every((_) => typeof _ === 'number' && Number.isInteger(_))
        ) {
            return { ia: gqlValue };
        } else if (Array.isArray(gqlValue) && gqlValue.every((_) => typeof _ === 'number')) {
            return { fa: gqlValue };
        } else if (Array.isArray(gqlValue) && gqlValue.every((_) => typeof _ === 'boolean')) {
            return { ba: gqlValue };
        } else if (Array.isArray(gqlValue) && gqlValue.every((_) => _ instanceof Date)) {
            return { da: gqlValue };
        } else if (typeof gqlValue === 'string') {
            return { s: gqlValue };
        } else if (typeof gqlValue === 'number' && Number.isInteger(gqlValue)) {
            return { i: gqlValue };
        } else if (typeof gqlValue === 'number') {
            return { f: gqlValue };
        } else if (typeof gqlValue === 'boolean') {
            return { b: gqlValue };
        } else if (gqlValue instanceof Date) {
            return { d: gqlValue };
        } else {
            return null;
        }
    };

    return (await diff(left, right)).map((_) => {
        return {
            model: _.model,
            id: _.id,
            left: _.left === null ? null : _.left.id.toString(),
            right: _.right === null ? null : _.right.id.toString(),
            state: _.state,
            props: _.props.map((prop) => {
                return {
                    field: prop.field,
                    gqlField: prop.gqlField,
                    left: toBoxFromProp(prop.left),
                    right: toBoxFromProp(prop.right),
                    state: prop.state,
                    ref: prop.ref,
                };
            }),
        };
    });
};
