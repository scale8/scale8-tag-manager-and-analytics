import User from '../mongo/models/User';
import Revision from '../mongo/models/tag/Revision';
import Trigger from '../mongo/models/tag/Trigger';
import OperationOwner from '../enums/OperationOwner';
import GQLMethod from '../enums/GQLMethod';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import { RevisionEntityParentType } from '../enums/RevisionEntityParentType';

export const createGlobalTrigger = async (
    actor: User,
    name: string,
    revision: Revision,
    comments?: string,
): Promise<Trigger> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    const newTrigger = await repoFactory(Trigger).save(
        new Trigger(name, RevisionEntityParentType.REVISION, revision),
        actor,
        OperationOwner.USER,
        {
            gqlMethod: GQLMethod.CREATE,
            userComments: comments,
        },
    );
    revision.globalTriggerIds = [...revision.globalTriggerIds, newTrigger.id];
    await repoFactory(Revision).save(revision, actor, OperationOwner.USER, {
        gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
        opConnectedModels: [newTrigger],
    });
    return newTrigger;
};
