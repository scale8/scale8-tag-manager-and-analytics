import Model from '../mongo/abstractions/Model';
import User from '../mongo/models/User';
import { RCT } from '../container/ChainDependenciesBinder';
import Repo from '../mongo/abstractions/Repo';
import { ClientSession, ObjectId } from 'mongodb';
import userMessages from '../errors/UserMessages';
import DataError from '../errors/DataError';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import Shell from '../mongo/database/Shell';
import { ModelType } from '../mongo/types/Types';
import FieldProps from '../mongo/interfaces/FieldProps';
import OperationOwner from '../enums/OperationOwner';
import RepoFromRepoNameFactory from '../container/factoryTypes/RepoFromRepoNameFactory';
import GQLError from '../errors/GQLError';
import { duplicateModelWithSession } from './DuplicateUtils';

export const createNewModelBranchFromModel = async <T extends Model>(
    actor: User,
    oldModel: T,
    repository: RCT<Repo<Model>>,
): Promise<T> => {
    const getRevisionId = (): ObjectId => {
        const revisionId: ObjectId | undefined =
            (oldModel as any)['_revision_id'] instanceof ObjectId
                ? (oldModel as any)['_revision_id']
                : undefined;
        if (revisionId === undefined) {
            // Hide message in production
            throw new DataError(
                `Unexpected issue creating a new branch from ${oldModel.constructor.name}, revision id appears to be missing`,
                userMessages.genericDataFailure,
            );
        } else {
            return revisionId;
        }
    };
    return duplicateModelWithSession(
        actor,
        oldModel,
        repository,
        getRevisionId(),
        true,
        new ObjectId(),
    );
};

export const getNewModelsOrder = (currentOrder: ObjectId[], newOrder: string[]): ObjectId[] => {
    if (
        currentOrder.length === newOrder.length &&
        currentOrder.map((_) => _.toString()).every((_) => newOrder.indexOf(_) !== -1)
    ) {
        //the length is the same and every item has been accounted for...
        return newOrder.map((_) => new ObjectId(_));
    } else {
        throw new GQLError(userMessages.reOrderProblem, true);
    }
};

export const deleteModelCascading = async <T extends Model>(
    actor: User,
    deleteModel: T,
    testDelete = false,
    clientSession?: ClientSession,
): Promise<{ model: string; id: string; name: string }[]> => {
    const deleteAllLinkedModelsCascading = async <T extends Model>(
        actor: User,
        deleteModel: T,
        testDelete: boolean,
        clientSession?: ClientSession,
    ): Promise<{ model: string; id: string; name: string }[]> => {
        const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
        const repoFromNameFactory = container.get<RepoFromRepoNameFactory>(
            TYPES.RepoFromRepoNameFactory,
        );

        const modelRepo = repoFactory(deleteModel.constructor.name);
        const mapping = modelRepo.getMapping(deleteModel);
        const deletedChildren: { model: string; id: string; name: string }[] = (
            await Promise.all(
                Array.from(mapping.keys()).map(
                    async (key): Promise<{ model: string; id: string; name: string }[]> => {
                        //map this out to its new value...
                        const props = mapping.get(key) as FieldProps<ModelType>;
                        if (props.repository !== undefined) {
                            //we have cascade delete on these linked items...
                            const repo: Repo<Model> = repoFromNameFactory(props.repository.name);
                            const deleteValue = (deleteModel as any)[key];
                            if (deleteValue instanceof ObjectId) {
                                return await deleteModelCascading(
                                    actor,
                                    await repo.findByIdThrows(
                                        deleteValue,
                                        userMessages.deleteChildFailed,
                                    ),
                                    testDelete,
                                );
                            } else if (
                                Array.isArray(deleteValue) &&
                                deleteValue.every((v: any) => v instanceof ObjectId)
                            ) {
                                return (
                                    await Promise.all(
                                        (deleteValue as ObjectId[]).map(
                                            async (_) =>
                                                await deleteModelCascading(
                                                    actor,
                                                    await repo.findByIdThrows(
                                                        _,
                                                        userMessages.deleteChildFailed,
                                                    ),
                                                    testDelete,
                                                ),
                                        ),
                                    )
                                ).flat();
                            }
                        }
                        return [];
                    },
                ),
            )
        ).flat();
        const info = {
            model: deleteModel.constructor.name,
            id: deleteModel.id.toString(),
            name:
                typeof (deleteModel as any)['_name'] === 'string'
                    ? (deleteModel as any)['_name']
                    : 'Undefined',
        };
        if (!testDelete) {
            await modelRepo.delete(deleteModel, actor, OperationOwner.USER, undefined, undefined, {
                mongoOptions: {
                    session: clientSession,
                },
            });
        }
        return [...deletedChildren, info];
    };

    const shell = container.get<Shell>(TYPES.Shell);
    if (clientSession === undefined) {
        return shell.transactionWrap(async (session) =>
            deleteAllLinkedModelsCascading(actor, deleteModel, testDelete, session),
        );
    } else {
        //if there is an existing session... use that...
        return deleteAllLinkedModelsCascading(actor, deleteModel, testDelete, clientSession);
    }
};
