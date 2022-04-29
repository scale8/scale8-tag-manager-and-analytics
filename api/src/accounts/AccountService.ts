import { inject, injectable } from 'inversify';
import TagManagerAccount from '../mongo/models/tag/TagManagerAccount';
import DataManagerAccount from '../mongo/models/data/DataManagerAccount';
import OperationOwner from '../enums/OperationOwner';
import TYPES from '../container/IOC.types';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import GenericError from '../errors/GenericError';
import { LogPriority } from '../enums/LogPriority';
import userMessages from '../errors/UserMessages';

@injectable()
export default class AccountService {
    @inject(TYPES.RepoFromModelFactory) protected repoFactory!: RepoFromModelFactory;

    public async alignAccountWithSubscription(
        stripeProductId: string | undefined,
        account: TagManagerAccount | DataManagerAccount,
    ): Promise<void> {
        // ensure the account is in the right state
        if (
            (!account.enabled || account.isOnFreeTrial() || account.trialExpired()) &&
            stripeProductId !== undefined
        ) {
            const accountRepo = this.repoFactory(AccountService.accountToAccountTypeName(account));
            account.enabled = true;
            account.cancelTrial();

            await accountRepo.save(account, 'SYSTEM', OperationOwner.SYSTEM);
        }
    }

    public static accountToAccountTypeName(
        account: TagManagerAccount | DataManagerAccount,
    ): 'TagManagerAccount' | 'DataManagerAccount' {
        if (account.constructor.name === 'TagManagerAccount') {
            return 'TagManagerAccount';
        } else if (account.constructor.name === 'DataManagerAccount') {
            return 'DataManagerAccount';
        } else {
            throw new GenericError(
                `Account type ${account.constructor.name} has not been implemented yet`,
                LogPriority.ERROR,
                userMessages.accountFailed,
            );
        }
    }
}
