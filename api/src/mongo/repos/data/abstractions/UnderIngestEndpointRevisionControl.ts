import { injectable } from 'inversify';
import { OperationActor, SaveOptions } from '../../../types/Types';
import DataError from '../../../../errors/DataError';
import { ObjectId } from 'mongodb';
import IngestEndpointDataMap from '../../../models/data/IngestEndpointDataMap';
import IngestEndpointRevision from '../../../models/data/IngestEndpointRevision';
import userMessages from '../../../../errors/UserMessages';
import RepoUnderRevisionControl from '../../../abstractions/RepoUnderRevisionControl';

@injectable()
export default class UnderIngestEndpointRevisionControl<
    T extends IngestEndpointDataMap,
> extends RepoUnderRevisionControl<T> {
    protected readonly auditEnabled = true;

    protected async isRevisionFinal(ingestEndpointRevisionId: ObjectId): Promise<boolean> {
        //revision could be null at this stage if we are cloning. this is because children are cloned first before creating the new revision entity and linking it all back and finally saving.
        const revision = await this.repoFactory(IngestEndpointRevision).findById(
            ingestEndpointRevisionId,
        );
        //check to make sure revision is not in a final state, if it is, then nothing else can happen. final state is removed when cloning automatically.
        return revision !== null && revision.isFinal;
    }

    public async save(model: T, actor: OperationActor, saveOptions: SaveOptions = {}): Promise<T> {
        return this.saveUnderRevisionControl(
            model.ingestEndpointRevisionId,
            await this.isRevisionFinal(model.ingestEndpointRevisionId),
            model,
            actor,
            saveOptions,
        );
    }

    public async delete(model: T, actor: OperationActor): Promise<void> {
        if (await this.isRevisionFinal(model.ingestEndpointRevisionId)) {
            throw new DataError(userMessages.finalisedRevision, true);
        } else {
            return super.delete(model, actor);
        }
    }
}
