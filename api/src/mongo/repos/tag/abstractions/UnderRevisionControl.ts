import { injectable } from 'inversify';
import { OperationActor, SaveOptions } from '../../../types/Types';
import Tag from '../../../models/tag/Tag';
import RuleGroup from '../../../models/tag/RuleGroup';
import Rule from '../../../models/tag/Rule';
import Action from '../../../models/tag/Action';
import ActionGroup from '../../../models/tag/ActionGroup';
import ActionGroupDistribution from '../../../models/tag/ActionGroupDistribution';
import AppPlatformRevision from '../../../models/tag/AppPlatformRevision';
import Event from '../../../models/tag/Event';
import ConditionRule from '../../../models/tag/ConditionRule';
import DataMap from '../../../models/tag/DataMap';
import RepeatedDataMap from '../../../models/tag/RepeatedDataMap';
import Revision from '../../../models/tag/Revision';
import DataError from '../../../../errors/DataError';
import { ObjectID } from 'mongodb';
import Trigger from '../../../models/tag/Trigger';
import OperationOwner from '../../../../enums/OperationOwner';
import userMessages from '../../../../errors/UserMessages';
import RepoUnderRevisionControl from '../../../abstractions/RepoUnderRevisionControl';

@injectable()
export default class UnderRevisionControl<
    T extends
        | Tag
        | RuleGroup
        | Rule
        | Trigger
        | Action
        | ActionGroup
        | ActionGroupDistribution
        | AppPlatformRevision
        | Event
        | ConditionRule
        | DataMap
        | RepeatedDataMap,
> extends RepoUnderRevisionControl<T> {
    protected readonly auditEnabled = true;

    protected async isRevisionFinal(revisionId: ObjectID): Promise<boolean> {
        //revision could be null at this stage if we are cloning. this is because children are cloned first before creating the new revision entity and linking it all back and finally saving.
        const revision = await this.repoFactory(Revision).findById(revisionId);
        //check to make sure revision is not in a final state, if it is, then nothing else can happen. final state is removed when cloning automatically.
        return revision !== null && revision.isFinal;
    }

    public async save(
        model: T,
        actor: OperationActor,
        owner: OperationOwner = OperationOwner.USER,
        saveOptions: SaveOptions = {},
    ): Promise<T> {
        return this.saveUnderRevisionControl(
            model.revisionId,
            await this.isRevisionFinal(model.revisionId),
            model,
            actor,
            owner,
            saveOptions,
        );
    }

    public async delete(
        model: T,
        actor: OperationActor,
        owner: OperationOwner = OperationOwner.USER,
    ): Promise<void> {
        if (await this.isRevisionFinal(model.revisionId)) {
            throw new DataError(userMessages.finalisedRevisionRemoval, true);
        } else {
            return super.delete(model, actor, owner);
        }
    }
}
