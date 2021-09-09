import User from '../mongo/models/User';
import Tag from '../mongo/models/tag/Tag';
import Revision from '../mongo/models/tag/Revision';
import OperationOwner from '../enums/OperationOwner';
import GQLMethod from '../enums/GQLMethod';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import RuleGroup from '../mongo/models/tag/RuleGroup';
import Rule from '../mongo/models/tag/Rule';
import Trigger from '../mongo/models/tag/Trigger';
import ActionGroupDistribution from '../mongo/models/tag/ActionGroupDistribution';
import ActionGroup from '../mongo/models/tag/ActionGroup';
import { TagType } from '../enums/TagType';
import { RevisionEntityParentType } from '../enums/RevisionEntityParentType';

export const createTagSkeleton = async (
    actor: User,
    revision: Revision,
    name: string,
    type: TagType,
    width?: number,
    height?: number,
    autoLoad?: boolean,
    comments?: string,
): Promise<Tag> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    const autoGenerateComment = 'Auto-generated when creating skeleton structure for new tag';
    const newTag = await repoFactory(Tag).save(
        new Tag(
            name,
            type,
            typeof width === 'number' && Number.isInteger(width) ? width : 0,
            typeof height === 'number' && Number.isInteger(height) ? height : 0,
            revision,
            autoLoad === true,
            [
                await repoFactory(RuleGroup).save(
                    new RuleGroup('Rule Group 1', revision, [
                        await repoFactory(Rule).save(
                            new Rule(
                                'Rule 1',
                                revision,
                                await repoFactory(Trigger).save(
                                    new Trigger(
                                        'Custom Trigger',
                                        RevisionEntityParentType.RULE,
                                        revision,
                                    ),
                                    actor,
                                    OperationOwner.USER,
                                    {
                                        gqlMethod: GQLMethod.CREATE,
                                        userComments: autoGenerateComment,
                                    },
                                ),
                                [
                                    await repoFactory(ActionGroupDistribution).save(
                                        new ActionGroupDistribution(
                                            'Action Group Distribution 1',
                                            RevisionEntityParentType.RULE,
                                            revision,
                                            [
                                                await repoFactory(ActionGroup).save(
                                                    new ActionGroup('Action Group 1', revision),
                                                    actor,
                                                    OperationOwner.USER,
                                                    {
                                                        gqlMethod: GQLMethod.CREATE,
                                                        userComments: autoGenerateComment,
                                                    },
                                                ),
                                            ],
                                        ),
                                        actor,
                                        OperationOwner.USER,
                                        {
                                            gqlMethod: GQLMethod.CREATE,
                                            userComments: autoGenerateComment,
                                        },
                                    ),
                                ],
                            ),
                            actor,
                            OperationOwner.USER,
                            {
                                gqlMethod: GQLMethod.CREATE,
                                userComments: autoGenerateComment,
                            },
                        ),
                    ]),
                    actor,
                    OperationOwner.USER,
                    {
                        gqlMethod: GQLMethod.CREATE,
                        userComments: autoGenerateComment,
                    },
                ),
            ],
        ),
        actor,
        OperationOwner.USER,
        {
            gqlMethod: GQLMethod.CREATE,
            userComments: comments,
        },
    );
    //link this back to the parent entity...
    revision.tagIds = [...revision.tagIds, newTag.id];
    await repoFactory(Revision).save(revision, actor, OperationOwner.USER, {
        gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
        opConnectedModels: [newTag],
    });
    return newTag;
};
