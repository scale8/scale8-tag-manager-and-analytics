import { injectable } from 'inversify';
import Repo from '../../abstractions/Repo';
import TagManagerAccount from '../../models/tag/TagManagerAccount';
import userMessages from '../../../errors/UserMessages';
import GenericError from '../../../errors/GenericError';
import Org from '../../models/Org';
import { LogPriority } from '../../../enums/LogPriority';
import { IndexDescription } from 'mongodb';

@injectable()
export default class TagManagerAccountRepo extends Repo<TagManagerAccount> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexDescription[] = [
        {
            key: {
                _org_id: 1,
            },
        },
    ];

    public async getFromOrg(org: Org): Promise<TagManagerAccount> {
        const account = await this.findOne({
            _org_id: org.id,
        });
        if (account === null) {
            throw new GenericError(
                'Unable to find tag manager account',
                LogPriority.ERROR,
                userMessages.accountFailed,
            );
        }
        return account;
    }
}
