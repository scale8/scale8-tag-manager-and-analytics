import { inject, injectable } from 'inversify';
import Model from './Model';
import { CT, ModelType, MongoType, OperationActor, SaveOptions } from '../types/Types';
import TYPES from '../../container/IOC.types';
import FieldProps from '../interfaces/FieldProps';
import ModelReflect from '../reflect/ModelReflect';
import {
    Collection,
    Filter,
    IndexDescription,
    ObjectId,
    Document,
    InsertOneOptions, FindOneAndUpdateOptions,
} from 'mongodb';
import User from '../models/User';
import AuditAction from '../../enums/AuditAction';
import Audit from '../models/Audit';
import ModelFromRepoFactory from '../../container/factoryTypes/ModelFromRepoFactory';
import Shell from '../database/Shell';
import DataError from '../../errors/DataError';
import ScalarContainer from '../custom/ScalarContainer';
import RepoFromModelFactory from '../../container/factoryTypes/RepoFromModelFactory';
import RepoFromRepoNameFactory from '../../container/factoryTypes/RepoFromRepoNameFactory';
import { RCT } from '../../container/ChainDependenciesBinder';
import GenericError from '../../errors/GenericError';
import EntityNotFoundError from '../../errors/EntityNotFoundError';
import OperationOwner from '../../enums/OperationOwner';
import GQLMethod from '../../enums/GQLMethod';
import DatabaseError from '../../errors/DatabaseError';
import userMessages from '../../errors/UserMessages';
import { SortDirection } from '../../enums/SortDirection';
import BaseLogger from '../../backends/logging/abstractions/BaseLogger';
import BaseConfig from '../../backends/configuration/abstractions/BaseConfig';

@injectable()
export default abstract class Repo<T extends Model> {
    protected readonly model: CT<T>;
    protected readonly modelFromRepoFactory: ModelFromRepoFactory;
    protected readonly auditEnabled: boolean = false;
    protected readonly indexes: IndexDescription[] = [];

    @inject(TYPES.BackendConfig) protected readonly config!: BaseConfig;
    @inject(TYPES.RepoFromModelFactory) protected readonly repoFactory!: RepoFromModelFactory;

    @inject(TYPES.RepoFromRepoNameFactory)
    protected readonly repoFromNameFactory!: RepoFromRepoNameFactory;

    @inject(TYPES.Shell) protected readonly shell!: Shell;
    @inject(TYPES.BackendLogger) protected readonly logger!: BaseLogger;

    public repoName = this.constructor.name;

    // public forModel = () => this.model.name;

    public constructor(@inject(TYPES.ModelFromRepoFactory) modelFactory: ModelFromRepoFactory) {
        this.modelFromRepoFactory = modelFactory;
        this.model = this.modelFromRepoFactory(this.constructor.name);
    }

    protected async getRepoCollection(): Promise<Collection> {
        return await this.shell.getCollection(this.model.name);
    }

    public async createIndexes(): Promise<void> {
        if (this.indexes.length > 0) {
            await (await this.getRepoCollection()).createIndexes(this.indexes);
        }
    }

    public getMapping(model: Model): Map<string, FieldProps<ModelType>> {
        return ModelReflect.getMappingForCollection(model.constructor.name);
    }

    public createNewModel<U extends Model>(type: { new (): U }): U {
        return new type();
    }

    private toModelType(result: MongoType, repository?: RCT<Repo<Model>>): Model {
        const model = this.createNewModel<Model>(
            this.modelFromRepoFactory(
                repository !== undefined ? repository.name : this.constructor.name,
            ),
        );
        const modelMapping = this.getMapping(model);
        modelMapping.forEach((v, k) => {
            const resultItem = (result as any)[k];
            if (resultItem !== undefined) {
                if (typeof resultItem === 'object' && Array.isArray(resultItem.__arr)) {
                    (model as any)[k] = new ScalarContainer(...resultItem.__arr);
                } else if (v.repository === undefined || resultItem instanceof ObjectId) {
                    (model as any)[k] = resultItem;
                } else if (Array.isArray(resultItem) && resultItem.length === 0) {
                    (model as any)[k] = []; //empty array.
                } else if (
                    Array.isArray(resultItem) &&
                    resultItem.every((v: any) => v instanceof ObjectId)
                ) {
                    (model as any)[k] = resultItem;
                } else {
                    //otherwise we have to do some magic and build it...
                    if (Array.isArray(resultItem)) {
                        (model as any)[k] = resultItem.map((r: any) =>
                            this.toModelType(r, v.repository),
                        );
                    } else {
                        (model as any)[k] = this.toModelType(resultItem, v.repository);
                    }
                }
            }
        });
        model['___previous'] = model.cloneModelData();
        return model;
    }

    public async findByIdThrows(
        id: ObjectId,
        userMessage?: string,
        error: GenericError = new EntityNotFoundError(
            `Unable to find id '${id}' on ${this.model.name}`,
            'Record Not Found',
        ),
    ): Promise<T> {
        const result = await this.findById(id);
        if (result === null) {
            if (userMessage !== undefined) {
                throw new EntityNotFoundError(
                    `Unable to find id '${id}' on ${this.model.name}`,
                    userMessage,
                );
            }
            throw error;
        } else {
            return result;
        }
    }

    public async findOneThrows(
        query: Filter<Document>,
        userMessage?: string,
        sort: { [k: string]: SortDirection } = {},
        commonFilter: Filter<Document> = { _is_deleted: { $eq: false } },
        error: GenericError = new EntityNotFoundError(
            `Unable to find one on ${this.model.name}`,
            'Record Not Found',
        ),
    ): Promise<T> {
        const result = await this.findOne(query, sort, commonFilter);
        if (result === null) {
            if (userMessage !== undefined) {
                throw new EntityNotFoundError(
                    `Unable to find one on ${this.model.name}`,
                    userMessage,
                );
            }
            throw error;
        } else {
            return result;
        }
    }

    public async findById(id: ObjectId): Promise<T | null> {
        return await this.findOne({ _id: id });
    }

    public async findByIds(ids: ObjectId[], limit = 1000): Promise<T[]> {
        const res = await this.find({ _id: { $in: ids } }, {}, limit);
        const idModelMap = new Map(res.map((_) => [_.id.toString(), _]));
        return ids.map((_) => {
            const model = idModelMap.get(_.toString());
            if (model === undefined) {
                // Hide message in production
                throw new DataError(
                    `Failed to find model ${_.toString()} on ${this.model.name}`,
                    userMessages.genericDataFailure,
                );
            } else {
                return model;
            }
        });
    }

    public async findOne(
        query: Filter<Document>,
        sort: { [k: string]: SortDirection } = {},
        commonFilter: Filter<Document> = { _is_deleted: { $eq: false } },
    ): Promise<T | null> {
        const result = await this.find(query, sort, 1, commonFilter);
        return result.length === 0 ? null : result[0];
    }

    public async count(
        query: Filter<Document>,
        commonFilter: Filter<Document> = { _is_deleted: { $eq: false } },
    ): Promise<number> {
        const collection = await this.getRepoCollection();
        return collection.countDocuments({ ...query, ...commonFilter });
    }

    public async find(
        query: Filter<Document>,
        sort: { [k: string]: SortDirection } = {},
        limit = 1000,
        commonFilter: Filter<Document> = { _is_deleted: { $eq: false } },
    ): Promise<T[]> {
        const collection = await this.getRepoCollection();
        const docs = await collection
            .find({ ...query, ...commonFilter })
            .sort(sort)
            .limit(limit)
            .toArray();
        await this.logger.database(
            `Query on ${this.model.name}, returned ${docs.length} results`,
            query,
        );
        return docs.map((doc) => this.toModelType(doc) as T);
    }

    public async delete(
        model: T,
        actor: User | 'SYSTEM',
        owner: OperationOwner = OperationOwner.USER,
        method?: GQLMethod,
        comments?: string,
        saveOptions?: SaveOptions,
    ): Promise<void> {
        //we do not want a set method on model for this!
        (model as any)['_is_deleted'] = true;
        (model as any)['_deleted_at'] = new Date();
        const deletedModel = await this.save(model, actor, owner, saveOptions);
        await this.logger.database(`Deleted data on ${this.model.name}`, deletedModel.toGQLType());
        await this.recordAudit(actor, owner, deletedModel, AuditAction.Delete, method, comments);
    }

    public async hardDelete(
        model: T,
        actor: User | 'SYSTEM',
        owner: OperationOwner = OperationOwner.USER,
        method?: GQLMethod,
        comments?: string,
    ): Promise<void> {
        const collection = await this.getRepoCollection();
        const query = { _id: model.id };
        const result = await collection.deleteOne(query);
        if (result.acknowledged) {
            await this.logger.database(`Hard Delete on ${this.model.name}`, query);
            await this.recordAudit(actor, owner, model, AuditAction.Delete, method, comments);
        } else {
            throw new DatabaseError(
                'Failed to execute delete correctly',
                userMessages.genericDataFailure,
            );
        }
    }

    public async save(
        model: T,
        actor: User | 'SYSTEM',
        owner: OperationOwner = OperationOwner.USER,
        saveOptions: SaveOptions = {},
    ): Promise<T> {
        const setCommand: {
            $set: { [p: string]: MongoType };
            $unset: { [p: string]: string };
        } = model.toSetCommand();
        const forceCreate = saveOptions.forceCreate === undefined ? false : saveOptions.forceCreate;
        const commonOptions =
            saveOptions.mongoOptions === undefined ? {} : saveOptions.mongoOptions;
        await this.logger.database(`Save data on ${this.model.name}`, setCommand);
        if (model.isSaved() && !forceCreate) {
            return this.update(
                model,
                setCommand,
                actor,
                owner,
                commonOptions,
                saveOptions.gqlMethod,
                saveOptions.userComments,
                saveOptions.opConnectedModels,
            );
        } else {
            if (forceCreate) {
                setCommand.$set = { ...setCommand.$set, ...{ _id: model.id } };
            }
            return this.create(
                setCommand,
                actor,
                owner,
                commonOptions,
                saveOptions.gqlMethod,
                saveOptions.userComments,
                saveOptions.opConnectedModels,
            );
        }
    }

    private async create(
        setCommand: {
            $set: { [p: string]: MongoType };
            $unset: { [p: string]: string };
        },
        actor: User | 'SYSTEM',
        owner: OperationOwner,
        insertOneOptions: InsertOneOptions,
        method?: GQLMethod,
        comments?: string,
        opConnectedModels?: Model[],
    ): Promise<T> {
        const collection = await this.getRepoCollection();
        const result = await collection.insertOne(setCommand.$set, insertOneOptions);
        if (result.acknowledged) {
            const newModel = this.toModelType(setCommand.$set) as T;
            await this.logger.database(
                `Save result on ${this.model.name}`,
                setCommand.$set,
            );
            await this.recordAudit(
                actor,
                owner,
                newModel,
                AuditAction.Create,
                method,
                comments,
                opConnectedModels,
            );
            return newModel;
        } else {
            throw new DatabaseError(
                'Failed to execute save correctly',
                userMessages.genericDataFailure,
            );
        }
    }

    private async update(
        model: T,
        setCommand: {
            $set: { [p: string]: MongoType };
            $unset: { [p: string]: string };
        },
        actor: User | 'SYSTEM',
        owner: OperationOwner,
        findOneAndUpdateOptions: FindOneAndUpdateOptions,
        method?: GQLMethod,
        comments?: string,
        opConnectedModels?: Model[],
    ): Promise<T> {
        if (Object.keys(setCommand.$set).length === 0 && Object.keys(setCommand.$unset).length) {
            return model;
        } else {
            const cmd = {};
            if (Object.keys(setCommand.$set).length > 0) {
                (cmd as any)['$set'] = setCommand.$set;
            }
            if (Object.keys(setCommand.$unset).length > 0) {
                (cmd as any)['$unset'] = setCommand.$unset;
            }
            const collection = await this.getRepoCollection();
            const result = await collection.findOneAndUpdate({ _id: model.id }, cmd, findOneAndUpdateOptions);
            if (result.ok === 1) {
                await this.logger.database(`Update result on ${this.model.name}`, setCommand);
                await this.recordAudit(
                    actor,
                    owner,
                    model,
                    AuditAction.Update,
                    method,
                    comments,
                    opConnectedModels,
                );
                return model;
            } else {
                throw new DatabaseError(
                    'Failed to execute update correctly',
                    userMessages.genericDataFailure,
                );
            }
        }
    }

    private async recordAudit(
        actor: OperationActor,
        owner: OperationOwner,
        model: Model,
        action: AuditAction,
        method?: GQLMethod,
        comments?: string,
        opConnectedModels?: Model[],
    ): Promise<void> {
        if (this.auditEnabled && (await this.config.isAuditEnabled())) {
            await this.logger.database(`Save audit data for ${action} on ${this.model.name}`);
            const audit = new Audit(
                actor,
                owner,
                model,
                action,
                method,
                comments,
                opConnectedModels,
            );
            const data = audit.toMongoType();
            const auditCollection = await this.shell.getCollection(Audit.name);
            await auditCollection.insertOne(data);
        }
    }
}
