import { ObjectID } from 'mongodb';
import Field from '../decorators/Field';
import RequiredFieldMissingError from '../../errors/RequiredFieldMissingError';
import { ConfigType, GQLScalar, GQLType, ModelType, MongoType } from '../types/Types';
import FieldProps from '../interfaces/FieldProps';
import ModelReflect from '../reflect/ModelReflect';
import GQLError from '../../errors/GQLError';
import ValidationError from '../../errors/ValidationError';
import Hash from '../../core/Hash';
import ScalarContainer from '../custom/ScalarContainer';
import DatabaseError from '../../errors/DatabaseError';
import userMessages from '../../errors/UserMessages';

export default abstract class Model {
    private ___previous?: { [k: string]: ModelType | undefined };

    public getPrevious(): { [k: string]: ModelType | undefined } | undefined {
        return this.___previous;
    }

    public getOrgEntityId(): ObjectID {
        throw new DatabaseError(
            `Org entity has not been defined on ${this.constructor.name}`,
            userMessages.genericDataFailure,
        );
    }

    @Field<ObjectID>({
        required: false, //this will be auto populated on save...
        exposeToGQLAs: 'id',
    })
    private _id?: ObjectID;

    @Field<ScalarContainer<string>>({
        required: false,
    })
    private _clone_maps?: ScalarContainer<string>;

    @Field<string>({
        required: true, //this will be auto populated on save...
        defaultValue: () => Hash.shortRandomHash(), //we need an unique index on this!
        exposeToGQLAs: 'persisting_id',
        exposeToConfig: true,
    })
    private ___persisting_id!: string;

    @Field<boolean>({
        required: true,
        defaultValue: () => false,
    })
    private _is_deleted!: boolean;

    @Field<Date>({
        required: true,
        exposeToGQLAs: 'created_at',
        defaultValue: () => new Date(),
    })
    private _created_at?: Date;

    @Field<Date>({
        required: true,
        exposeToGQLAs: 'updated_at',
        defaultValue: () => new Date(),
        onUpdate: () => new Date(),
    })
    private _updated_at?: Date;

    @Field<Date>({
        required: false,
    })
    private _deleted_at?: Date;

    get id(): ObjectID {
        if (this._id === undefined) {
            // Hide message in production
            throw new RequiredFieldMissingError('_id is undefined somehow');
        } else {
            return this._id;
        }
    }

    get cloneMaps(): ScalarContainer<string> | undefined {
        return this._clone_maps;
    }

    get _persisting_id(): string {
        if (this.___persisting_id === undefined) {
            // Hide message in production
            throw new RequiredFieldMissingError('___persisting_id is undefined somehow');
        } else {
            return this.___persisting_id;
        }
    }

    set _persisting_id(value: string) {
        if (this.___persisting_id === undefined) {
            this.___persisting_id = value;
        } else {
            // Hide message in production
            throw new RequiredFieldMissingError(
                'once set, ___persisting_id should never be updated',
            );
        }
    }

    get created_at(): Date {
        if (this._created_at === undefined) {
            // Hide message in production
            throw new RequiredFieldMissingError('_created_at is undefined somehow');
        } else {
            return this._created_at;
        }
    }

    get updated_at(): Date {
        if (this._updated_at === undefined) {
            // Hide message in production
            throw new RequiredFieldMissingError('_updated_at is undefined somehow');
        } else {
            return this._updated_at;
        }
    }

    get deleted_at(): Date | undefined {
        return this._deleted_at;
    }

    public isSaved(): boolean {
        return this._id !== undefined;
    }

    public getMapping(): Map<string, FieldProps<ModelType>> {
        return ModelReflect.getMappingForCollection(this.constructor.name);
    }

    public bulkGQLSet(obj: { [k: string]: any }, only?: string[]): void {
        this.getMapping().forEach((fieldProps, fieldName) => {
            if (
                fieldProps.exposeToGQLAs !== undefined &&
                fieldName !== '_id' &&
                obj.hasOwnProperty(fieldProps.exposeToGQLAs) &&
                (only === undefined || only.indexOf(fieldProps.exposeToGQLAs) !== -1)
            ) {
                (this as any)[fieldName] = obj[fieldProps.exposeToGQLAs];
            }
        });
    }

    public toConfig(): ConfigType {
        const obj: ConfigType = {};
        const toConfigType = (
            a: ModelType,
        ): GQLScalar | GQLScalar[] | ConfigType | ConfigType[] => {
            if (typeof a === 'string' || typeof a === 'number' || typeof a === 'boolean') {
                return a;
            } else if (a === null || a === undefined) {
                return null;
            } else if (a instanceof Date) {
                return { ___type: 'Date', value: a.getTime() };
            } else if (a instanceof ObjectID) {
                return { ref: a.toString() };
            } else if (a instanceof ScalarContainer) {
                return a.arr;
            } else if (Array.isArray(a) && (a as any[]).every((v) => v instanceof ObjectID)) {
                return (a as ObjectID[]).map((_) => {
                    return { ref: _.toString() };
                });
            } else {
                throw new GQLError(
                    `Unable to covert ${a.toString()} to GQL type`,
                    userMessages.conversionError,
                );
            }
        };
        this.getMapping().forEach((fieldProps, fieldName) => {
            if (fieldProps.exposeToConfigUsing !== undefined) {
                obj[fieldName] = fieldProps.exposeToConfigUsing((this as any)[fieldName]);
            } else if (fieldProps.exposeToConfig === true) {
                obj[fieldName] = toConfigType((this as any)[fieldName]);
            }
        });
        return obj;
    }

    /*
        - This is single depth. It is not recursive by design.
        - Expose nested documents in a flat structure in a new query to GQL.
     */
    public toGQLType(extras: { [k: string]: GQLScalar | GQLScalar[] } = {}): GQLType {
        const obj: { [k: string]: GQLScalar | GQLScalar[] } = {};
        const toGQL = (a: ModelType): GQLScalar | GQLScalar[] => {
            if (typeof a === 'string' || typeof a === 'number' || typeof a === 'boolean') {
                return a;
            } else if (a === null || a === undefined) {
                return null;
            } else if (a instanceof Date) {
                return a;
            } else if (a instanceof ObjectID) {
                return a.toString();
            } else if (a instanceof ScalarContainer) {
                return a.arr.map((_) => _.toString());
            } else if (Array.isArray(a) && (a as any[]).every((v) => v instanceof ObjectID)) {
                return (a as ObjectID[]).map((_) => _.toString());
            } else {
                throw new GQLError(
                    `Unable to covert ${a.toString()} to GQL type`,
                    userMessages.conversionError,
                );
            }
        };
        this.getMapping().forEach((fieldProps, fieldName) => {
            if (fieldProps !== undefined && typeof fieldProps.exposeToGQLAs === 'string') {
                obj[fieldProps.exposeToGQLAs] = toGQL((this as any)[fieldName]);
            }
        });
        return { ...obj, ...extras };
    }

    protected modelTypeToMongoType(modelType: ModelType): MongoType {
        if (
            typeof modelType === 'string' ||
            typeof modelType === 'number' ||
            typeof modelType === 'boolean'
        ) {
            return modelType;
        } else if (modelType === null) {
            return null;
        } else if (modelType instanceof Date || modelType instanceof ObjectID) {
            return modelType;
        } else if (modelType instanceof ScalarContainer) {
            return { __arr: modelType.arr };
        } else if (Array.isArray(modelType) && modelType.length === 0) {
            return [];
        } else if (
            Array.isArray(modelType) &&
            (modelType as any[]).every((v) => v instanceof ObjectID)
        ) {
            return modelType as ObjectID[];
        } else if (
            Array.isArray(modelType) &&
            (modelType as any[]).every((v) => v instanceof Model)
        ) {
            return (modelType as Model[]).map((m) => m.toMongoType());
        } else {
            return (modelType as Model).toMongoType();
        }
    }

    public cloneModelData(): {
        [k: string]: ModelType | undefined;
    } {
        const getClonedValue = (
            v: ModelType | undefined,
        ):
            | ModelType
            | { [k: string]: ModelType | undefined }
            | { [k: string]: ModelType | undefined }[]
            | undefined => {
            if (v === undefined) {
                return undefined;
            } else if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
                return v;
            } else if (v === null) {
                return null;
            } else if (v instanceof Date) {
                return new Date(v.toISOString());
            } else if (v instanceof ScalarContainer) {
                return new ScalarContainer(
                    ...v.arr.map((_) => (_ instanceof Date ? new Date(_.toISOString()) : _)),
                );
            } else if (v instanceof ObjectID) {
                return new ObjectID(v.toString());
            } else if (Array.isArray(v) && v.length === 0) {
                return [];
            } else if (Array.isArray(v) && (v as any[]).every((_) => _ instanceof ObjectID)) {
                return (v as ObjectID[]).map((_) => new ObjectID(_.toString()));
            } else if (Array.isArray(v) && (v as any[]).every((_) => _ instanceof Model)) {
                return (v as Model[]).map((_) => _.cloneModelData());
            } else if (v instanceof Model) {
                return v.cloneModelData();
            } else {
                throw new DatabaseError(
                    'Unable to clone property',
                    userMessages.genericDataFailure,
                );
            }
        };
        const clonedData = {};
        this.getMapping().forEach((fieldProps, fieldName) => {
            const value = (this as any)[fieldName];
            if (Array.isArray(value) && value.length === 0) {
                (clonedData as any)[fieldName] = []; //handle empty array for array of models that is currently omitted
            } else {
                (clonedData as any)[fieldName] = getClonedValue((this as any)[fieldName]);
            }
        });
        return clonedData;
    }

    public toMongoType(): { [k: string]: MongoType } {
        const obj: { [k: string]: MongoType } = {};
        this.toMap().forEach((v, k) => {
            if (k !== '_id' && v !== undefined) {
                obj[k] = this.modelTypeToMongoType(v);
            }
        });
        return obj;
    }

    protected modelTypesEqual(leftModelType?: ModelType, rightModelType?: ModelType): boolean {
        if (leftModelType instanceof ObjectID && rightModelType instanceof ObjectID) {
            return leftModelType.equals(rightModelType);
        } else if (leftModelType instanceof Date && rightModelType instanceof Date) {
            return leftModelType.toISOString() === rightModelType.toISOString();
        } else if (
            leftModelType instanceof ScalarContainer &&
            rightModelType instanceof ScalarContainer
        ) {
            return leftModelType.equals(rightModelType);
        } else if (
            Array.isArray(leftModelType) &&
            Array.isArray(rightModelType) &&
            leftModelType.length === 0 &&
            rightModelType.length === 0
        ) {
            //empty array
            return true;
        } else if (
            Array.isArray(leftModelType) &&
            (leftModelType as any[]).every((v) => v instanceof ObjectID) &&
            Array.isArray(rightModelType) &&
            (rightModelType as any[]).every((v) => v instanceof ObjectID)
        ) {
            return (
                leftModelType.length === rightModelType.length &&
                (leftModelType as ObjectID[]).every((v, i) =>
                    v.equals((rightModelType as ObjectID[])[i]),
                )
            );
        }
        //todo. we can probably infer a model's equality, but could play havoc if we change model code later. (auto update of fields on save)
        return leftModelType === rightModelType; //simple strict js equality check...
    }

    public toSetCommand(): {
        $set: { [k: string]: MongoType };
        $unset: { [k: string]: string };
    } {
        const leftData = this.getPrevious();
        if (leftData === undefined) {
            return {
                $set: this.toMongoType(),
                $unset: {},
            };
        } else {
            const set: { [k: string]: MongoType } = {};
            const unset: { [k: string]: string } = {};
            this.toMap().forEach((v, k) => {
                if (k !== '_id') {
                    if (!this.modelTypesEqual(leftData[k], v)) {
                        if (v === undefined) {
                            unset[k] = '';
                        } else {
                            set[k] = this.modelTypeToMongoType(v);
                        }
                    }
                }
            });
            return {
                $set: set,
                $unset: unset,
            };
        }
    }

    public toMap(): Map<string, ModelType | undefined> {
        const map = new Map<string, ModelType | undefined>();
        this.getMapping().forEach((fieldProps, fieldName) => {
            //get value - check if property is required, then get using default value if required...
            const getValue: () => ModelType | undefined = () => {
                if ((this as any)[fieldName] === undefined) {
                    if (fieldProps.required === true) {
                        //if this is required, lets see if we can create it
                        if (typeof fieldProps.defaultValue === 'function') {
                            return fieldProps.defaultValue();
                        }
                        // Hide message in production
                        throw new RequiredFieldMissingError(
                            `Field '${fieldName}' is required on ${this.constructor.name} and has not yet been defined`,
                        );
                    }
                    return undefined;
                } else {
                    return (this as any)[fieldName];
                }
            };
            const value = getValue();
            if (value !== undefined) {
                //if value is not defined, it is not required, so we can skip this in true mongodb style :)
                //next validate...
                if (typeof fieldProps.validation === 'function') {
                    if (!fieldProps.validation(value)) {
                        throw new ValidationError(
                            `Field '${fieldName}' has failed validation on '${this.constructor.name}'.`,
                            userMessages.validationField(fieldName),
                        );
                    }
                }
                //next handle overrides - yes, this should be after validation, must conform to ModelType in guard.
                const getOverrideValue: (value: ModelType) => ModelType = (value: ModelType) => {
                    if (this.isSaved()) {
                        return typeof fieldProps.onUpdate === 'function'
                            ? fieldProps.onUpdate(value)
                            : value;
                    } else {
                        return typeof fieldProps.onInsert === 'function'
                            ? fieldProps.onInsert(value)
                            : value;
                    }
                };
                map.set(fieldName, getOverrideValue(value));
            } else {
                map.set(fieldName, undefined);
            }
        });
        return map;
    }
}
