import { injectable } from 'inversify';
import { OperationActor, SaveOptions } from '../../../types/Types';
import DataError from '../../../../errors/DataError';
import { ObjectId } from 'mongodb';
import PlatformAsset from '../../../models/tag/PlatformAsset';
import PlatformAction from '../../../models/tag/PlatformAction';
import PlatformDataContainer from '../../../models/tag/PlatformDataContainer';
import PlatformDataMap from '../../../models/tag/PlatformDataMap';
import PlatformEvent from '../../../models/tag/PlatformEvent';
import PlatformRevision from '../../../models/tag/PlatformRevision';
import PlatformActionPermission from '../../../models/tag/PlatformActionPermission';
import userMessages from '../../../../errors/UserMessages';
import RepoUnderRevisionControl from '../../../abstractions/RepoUnderRevisionControl';

@injectable()
export default class UnderPlatformRevisionControl<
    T extends
        | PlatformAction
        | PlatformActionPermission
        | PlatformAsset
        | PlatformDataContainer
        | PlatformDataMap
        | PlatformEvent,
> extends RepoUnderRevisionControl<T> {
    protected readonly auditEnabled = true;

    protected async isRevisionFinal(platformRevisionId: ObjectId): Promise<boolean> {
        //revision could be null at this stage if we are cloning. this is because children are cloned first before creating the new revision entity and linking it all back and finally saving.
        const revision = await this.repoFactory(PlatformRevision).findById(platformRevisionId);
        //check to make sure revision is not in a final state, if it is, then nothing else can happen. final state is removed when cloning automatically.
        return revision !== null && revision.isFinal;
    }

    public async save(model: T, actor: OperationActor, saveOptions: SaveOptions = {}): Promise<T> {
        return this.saveUnderRevisionControl(
            model.platformRevisionId,
            await this.isRevisionFinal(model.platformRevisionId),
            model,
            actor,
            saveOptions,
        );
    }

    public async delete(model: T, actor: OperationActor): Promise<void> {
        if (await this.isRevisionFinal(model.platformRevisionId)) {
            throw new DataError(userMessages.finalisedRevision, true);
        } else {
            return super.delete(model, actor);
        }
    }
}
