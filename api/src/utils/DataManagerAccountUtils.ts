import DataManagerAccount from '../mongo/models/data/DataManagerAccount';
import userMessages from '../errors/UserMessages';
import { AccountType } from '../enums/AccountType';
import GQLError from '../errors/GQLError';
import { ObjectId } from 'mongodb';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';

export const withUnManagedAccount = async <U>(
    dataManagerAccountId: ObjectId,
    doThis: (dataManagerAccount: DataManagerAccount) => Promise<U>,
): Promise<U> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    const dataManagerAccount = await repoFactory(DataManagerAccount).findByIdThrows(
        dataManagerAccountId,
        userMessages.accountFailed,
    );
    if (dataManagerAccount.accountType === AccountType.SYSTEM) {
        throw new GQLError(userMessages.endpointManaged, true);
    }
    return doThis(dataManagerAccount);
};
