import Repo from '../../abstractions/Repo';
import { injectable } from 'inversify';
import DataManagerAccount from '../../models/data/DataManagerAccount';
import Org from '../../models/Org';
import userMessages from '../../../errors/UserMessages';
import GQLError from '../../../errors/GQLError';
import { AccountType } from '../../../enums/AccountType';
import { IndexDescription } from 'mongodb';

@injectable()
export default class DataManagerAccountRepo extends Repo<DataManagerAccount> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexDescription[] = [
        {
            key: {
                _org_id: 1,
                _account_type: 1,
            },
        },
    ];

    public async getFromOrg(org: Org): Promise<DataManagerAccount> {
        const account = await this.findOne({
            _org_id: org.id,
            _account_type: AccountType.USER,
        });
        if (account === null) {
            throw new GQLError(userMessages.noDMAccount, true);
        }
        return account;
    }

    public async getSystemAccountFromOrg(org: Org): Promise<DataManagerAccount> {
        return this.findOneThrows(
            {
                _org_id: org.id,
                _account_type: AccountType.SYSTEM,
            },
            userMessages.accountFailed,
        );
    }
}
