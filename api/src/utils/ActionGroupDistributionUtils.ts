import User from '../mongo/models/User';
import ActionGroupDistribution from '../mongo/models/tag/ActionGroupDistribution';
import Rule from '../mongo/models/tag/Rule';
import Revision from '../mongo/models/tag/Revision';
import userMessages from '../errors/UserMessages';
import GQLMethod from '../enums/GQLMethod';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import ActionGroupDistributionRepo from '../mongo/repos/tag/ActionGroupDistributionRepo';
import { ActionGroupDistributionType } from '../enums/ActionGroupDistributionType';
import { RevisionEntityParentType } from '../enums/RevisionEntityParentType';

/**
 * Link ActionGroupDistribution back to the parent entity and return it
 *
 * @param parentEntity
 * @param newActionGroupDistribution
 * @param actor
 */
export async function linkAndReturnActionGroupDistribution(
    parentEntity: Rule | Revision,
    newActionGroupDistribution: ActionGroupDistribution,
    actor: User,
) {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    if (parentEntity instanceof Revision) {
        parentEntity.globalActionGroupDistributionIds = [
            ...parentEntity.globalActionGroupDistributionIds,
            newActionGroupDistribution.id,
        ];
        await repoFactory(Revision).save(parentEntity, actor, {
            gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
            opConnectedModels: [newActionGroupDistribution],
        });
    } else {
        const currentActionGroupDistributions = await repoFactory<ActionGroupDistributionRepo>(
            ActionGroupDistribution,
        ).getAllFromRule(parentEntity);
        parentEntity.setActionGroupDistributions([
            ...currentActionGroupDistributions,
            newActionGroupDistribution,
        ]);
        await repoFactory(Rule).save(parentEntity, actor, {
            gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
            opConnectedModels: [newActionGroupDistribution],
        });
    }
    return newActionGroupDistribution;
}

export const createActionGroupDistribution = async (
    actor: User,
    parentEntity: Rule | Revision,
    name: string,
    type: ActionGroupDistributionType,
    comments?: string,
): Promise<ActionGroupDistribution> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const revision =
        parentEntity instanceof Revision
            ? parentEntity
            : await repoFactory(Revision).findByIdThrows(
                  parentEntity.revisionId,
                  userMessages.revisionFailed,
              );
    const newActionGroupDistribution = await repoFactory(ActionGroupDistribution).save(
        new ActionGroupDistribution(
            name,
            parentEntity instanceof Revision
                ? RevisionEntityParentType.REVISION
                : RevisionEntityParentType.RULE,
            revision,
            [],
            type,
        ),
        actor,
        {
            gqlMethod: GQLMethod.CREATE,
            userComments: comments,
        },
    );
    return await linkAndReturnActionGroupDistribution(
        parentEntity,
        newActionGroupDistribution,
        actor,
    );
};
