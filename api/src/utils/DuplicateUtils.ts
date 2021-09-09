import Model from '../mongo/abstractions/Model';
import User from '../mongo/models/User';
import { RCT } from '../container/ChainDependenciesBinder';
import Repo from '../mongo/abstractions/Repo';
import { ClientSession, ObjectID } from 'mongodb';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import Shell from '../mongo/database/Shell';
import userMessages from '../errors/UserMessages';
import RepoFromRepoNameFactory from '../container/factoryTypes/RepoFromRepoNameFactory';
import ModelFromRepoFactory from '../container/factoryTypes/ModelFromRepoFactory';
import { ModelType } from '../mongo/types/Types';
import ScalarContainer from '../mongo/custom/ScalarContainer';
import DatabaseError from '../errors/DatabaseError';
import DataError from '../errors/DataError';
import FieldProps from '../mongo/interfaces/FieldProps';
import Hash from '../core/Hash';
import OperationOwner from '../enums/OperationOwner';
import GQLMethod from '../enums/GQLMethod';
import Dependency from '../mongo/models/Dependency';

export const duplicateModel = async <T extends Model>(
    actor: User,
    oldModel: T,
    repository: RCT<Repo<Model>>,
    clientSession?: ClientSession,
    revisionId?: ObjectID,
    asNewBranch?: boolean, //if we are creating 'as a new branch', we'll need to generate new persistence ids...
    newId?: ObjectID, //we can override the id of the item being cloned
): Promise<T> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const repoFromNameFactory = container.get<RepoFromRepoNameFactory>(
        TYPES.RepoFromRepoNameFactory,
    );
    const modelFromRepoFactory = container.get<ModelFromRepoFactory>(TYPES.ModelFromRepoFactory);

    const isParentModel = revisionId === undefined;
    const parentModelId = revisionId === undefined ? new ObjectID() : revisionId;

    //first fetch the correct model repo... (we may override underlying functions, so important)
    const modelRepo = repoFactory(oldModel.constructor.name);
    //second step, create a new instance of this model coming in...
    const newModel = modelRepo.createNewModel<Model>(modelFromRepoFactory(repository.name));
    //next fill it with 'deep copy' data
    const getNewValue = async (
        oldValue: ModelType,
        oldInstanceRepo: RCT<Repo<Model>> | undefined,
    ): Promise<ModelType> => {
        if (
            typeof oldValue === 'string' ||
            typeof oldValue === 'number' ||
            typeof oldValue === 'boolean'
        ) {
            return oldValue;
        } else if (oldValue === null) {
            return null;
        } else if (oldValue instanceof Date) {
            return new Date(oldValue.getTime());
        } else if (oldValue instanceof ScalarContainer) {
            return new ScalarContainer(...oldValue.arr);
        } else if (oldValue instanceof ObjectID) {
            if (oldInstanceRepo === undefined) {
                //direct copy
                return new ObjectID(oldValue); //used for parent relationships that need to hold.
            } else {
                //ok, we need to clone this object and need to fetch it first
                return (
                    await duplicateModel(
                        actor,
                        await repoFromNameFactory(oldInstanceRepo.name).findByIdThrows(
                            oldValue,
                            userMessages.duplicationFailed,
                        ),
                        oldInstanceRepo,
                        clientSession,
                        parentModelId,
                        asNewBranch,
                    )
                ).id;
            }
        } else if (
            Array.isArray(oldValue) &&
            (oldValue as any[]).every((v) => v instanceof ObjectID)
        ) {
            return (await Promise.all(
                (oldValue as ObjectID[]).map(async (v) => await getNewValue(v, oldInstanceRepo)),
            )) as ObjectID[];
        } else {
            // Hide message in production
            throw new DatabaseError(
                `Unable to duplicate ${oldModel.constructor.name}, type is not supported...`,
                userMessages.genericDataFailure,
            );
        }
    };

    //get the new model data
    const mapping = modelRepo.getMapping(newModel);

    if (!mapping.has('_name')) {
        // Hide message in production
        throw new DataError(
            `All duplicate models must contain a _name property, this is missing for ${newModel.constructor.name}`,
            userMessages.genericDataFailure,
        );
    }

    if (isParentModel) {
        //we have to set the new _id manually...
        (newModel as any)['_id'] = parentModelId;
        //track who the parent was so we can work out branches and timelines properly
        (newModel as any)['_parent_revision_id'] = oldModel.id;
    } else {
        if (newId !== undefined) {
            //we have to force a new id against this model...
            (newModel as any)['_id'] = newId;
        }
        //otherwise, check every model has both _name and _revision_id fields. both are required!
        if (mapping.has('_revision_id')) {
            (newModel as any)['_revision_id'] = parentModelId;
        } else {
            // Hide message in production
            throw new DataError(
                `In order to duplicate a child model, a child model must have a _revision_id, this is missing for ${newModel.constructor.name}`,
                userMessages.genericDataFailure,
            );
        }
    }

    //add to any cloned history...
    const cloneRecord = `${oldModel.id.toString()}/${new Date().toISOString()}`;
    if (oldModel.cloneMaps === undefined) {
        //this is the first time we are cloning from this model...
        (newModel as any)['_clone_maps'] = new ScalarContainer<string>(cloneRecord);
    } else {
        //we've cloned from this entity before, so need to append the clone record...
        (newModel as any)['_clone_maps'] = new ScalarContainer<string>(
            ...oldModel.cloneMaps.arr,
            cloneRecord,
        );
    }

    (
        await Promise.all(
            Array.from(mapping.keys())
                .filter(
                    (key) =>
                        key.match(
                            /^(_id|_created_at|_deleted_at|_revision_id|_parent_revision_id|_clone_maps|_is_final|_is_published)$/,
                        ) === null,
                )
                .map(async (key) => {
                    //map this out to its new value...
                    const props = mapping.get(key) as FieldProps<ModelType>;
                    const oldValue = (oldModel as any)[key];
                    if (oldValue === undefined) {
                        return undefined;
                    } else {
                        return { k: key, v: await getNewValue(oldValue, props.repository) };
                    }
                }),
        )
    ).forEach((data) => {
        if (data !== undefined) {
            (newModel as any)[data.k] = data.v;
        }
    });

    if (asNewBranch === true) {
        (newModel as any)['___persisting_id'] = Hash.randomHash();
        delete (newModel as any)['_tag_code']; //if we are creating a hard fork, then need to generate this...
    }

    if (isParentModel) {
        //set a unique name... (force this)
        (newModel as any)['_name'] = parentModelId.toString();
    }

    const dupe = (await modelRepo.save(newModel, actor, OperationOwner.USER, {
        gqlMethod: GQLMethod.DUPLICATE,
        userComments: `Created a new duplicate`,
        forceCreate: isParentModel || newId !== undefined,
        mongoOptions: {
            session: clientSession,
            j: true,
            w: 'majority',
        },
    })) as T;

    //we need to clone any dep links...
    await Promise.all(
        (
            await repoFactory(Dependency).find({
                _model_id: oldModel.id,
            })
        ).map((oldDep) =>
            repoFactory(Dependency).save(
                new Dependency(
                    dupe.id,
                    dupe.constructor.name,
                    oldDep.dependsOnModelId,
                    oldDep.dependsOnModelName,
                ),
                actor,
                OperationOwner.USER,
                {
                    mongoOptions: {
                        session: clientSession,
                        j: true,
                        w: 'majority',
                    },
                },
            ),
        ),
    );

    //finally return the new, saved model
    return dupe;
};

export const duplicateModelWithSession = async <T extends Model>(
    actor: User,
    oldModel: T,
    repository: RCT<Repo<Model>>,
    revisionId?: ObjectID,
    asNewBranch?: boolean,
    newId?: ObjectID, //we can override the id of the item being cloned
): Promise<T> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const shell = container.get<Shell>(TYPES.Shell);

    //fetch a clean saved copy back from the database...
    const cleanModel = await repoFactory(oldModel.constructor.name).findByIdThrows(
        oldModel.id,
        userMessages.duplicationFailed,
    );
    return shell.transactionWrap(async (session) =>
        duplicateModel(actor, cleanModel as T, repository, session, revisionId, asNewBranch, newId),
    );
};
