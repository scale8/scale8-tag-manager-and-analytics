import Revision from '../mongo/models/tag/Revision';
import PlatformRevision from '../mongo/models/tag/PlatformRevision';
import IngestEndpointRevision from '../mongo/models/data/IngestEndpointRevision';
import User from '../mongo/models/User';
import RevisionRepo from '../mongo/repos/tag/RevisionRepo';
import PlatformRevisionRepo from '../mongo/repos/tag/PlatformRevisionRepo';
import IngestEndpointRevisionRepo from '../mongo/repos/data/IngestEndpointRevisionRepo';
import DataError from '../errors/DataError';
import userMessages from '../errors/UserMessages';
import { duplicateModelWithSession } from './DuplicateUtils';
import { ObjectId } from 'mongodb';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import Trigger from '../mongo/models/tag/Trigger';
import GQLMethod from '../enums/GQLMethod';
import ActionGroupDistribution from '../mongo/models/tag/ActionGroupDistribution';

export const duplicateRevision = async <
    T extends Revision | PlatformRevision | IngestEndpointRevision,
>(
    actor: User,
    oldModel: T,
): Promise<T> => {
    const getRepository = () => {
        if (oldModel instanceof Revision) {
            return RevisionRepo;
        } else if (oldModel instanceof PlatformRevision) {
            return PlatformRevisionRepo;
        } else if (oldModel instanceof IngestEndpointRevision) {
            return IngestEndpointRevisionRepo;
        } else {
            // Hide message in production
            throw new DataError(
                'Unable to duplicate model, model is not supported',
                userMessages.genericDataFailure,
            );
        }
    };
    return duplicateModelWithSession(actor, oldModel, getRepository());
};

export const resolveRevision = async (revision: ObjectId | Revision): Promise<Revision> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    return revision instanceof ObjectId
        ? await repoFactory(Revision).findByIdThrows(revision, userMessages.revisionFailed)
        : revision;
};

export const unLinkFromRevision = async (
    linkedModel: Trigger | ActionGroupDistribution,
    me: User,
    comments: any,
): Promise<void> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const revision = await repoFactory(Revision).findByIdThrows(
        linkedModel.revisionId,
        userMessages.revisionFailed,
    );
    revision.globalTriggerIds = revision.globalTriggerIds.filter((_) => !_.equals(linkedModel.id));
    await repoFactory(Revision).save(revision, me, {
        gqlMethod: GQLMethod.DELETE_LINKED_ENTITY,
        userComments: comments,
        opConnectedModels: [linkedModel],
    });
};
