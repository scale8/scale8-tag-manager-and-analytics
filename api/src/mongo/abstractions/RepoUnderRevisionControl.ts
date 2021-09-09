import { injectable } from 'inversify';
import { OperationActor, SaveOptions } from '../types/Types';
import { ObjectID } from 'mongodb';
import DataError from '../../errors/DataError';
import OperationOwner from '../../enums/OperationOwner';
import userMessages from '../../errors/UserMessages';
import Repo from './Repo';
import Model from './Model';

@injectable()
export default class RepoUnderRevisionControl<T extends Model> extends Repo<T> {
    protected async saveUnderRevisionControl(
        revisionId: ObjectID,
        isRevisionFinal: boolean,
        model: T,
        actor: OperationActor,
        owner: OperationOwner = OperationOwner.USER,
        saveOptions: SaveOptions = {},
    ): Promise<T> {
        if (isRevisionFinal) {
            throw new DataError(userMessages.finalisedRevision, true);
        } else {
            if (!model.isSaved()) {
                if (
                    (await this.count({
                        _revision_id: revisionId,
                    })) >= (await this.config.getMaxRevisionElements())
                ) {
                    throw new DataError(userMessages.maxConstructor(model.constructor.name), true);
                }
            }
            return super.save(model, actor, owner, saveOptions);
        }
    }
}
