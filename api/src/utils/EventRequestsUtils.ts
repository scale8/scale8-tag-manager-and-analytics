import App from '../mongo/models/tag/App';
import userMessages from '../errors/UserMessages';
import TYPES from '../container/IOC.types';
import BaseDatabase from '../backends/databases/abstractions/BaseDatabase';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import OrgAuth from '../auth/OrgAuth';
import CTX from '../gql/ctx/CTX';
import Revision from '../mongo/models/tag/Revision';
import Environment from '../mongo/models/tag/Environment';
import { StorageProvider } from '../enums/StorageProvider';

export const fetchEventRequests = async (
    filterOptionsKey: string,
    model: Revision | Environment,
    args: any,
    ctx: CTX,
): Promise<{
    result: { key: string; user_count: number; event_count: number }[];
    from: Date;
    to: Date;
}> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const backendDatabaseFactory: (storage_provider: StorageProvider) => BaseDatabase =
        container.get(TYPES.BackendDatabaseFactory);
    const orgAuth = container.get<OrgAuth>(TYPES.OrgAuth);
    return await orgAuth.asUserWithViewAccess(ctx, model.orgId, async () => {
        const app = await repoFactory(App).findByIdThrows(model.appId, userMessages.appFailed);
        args.query_options.filter_options[filterOptionsKey] = model.id.toString();
        if (
            app.storageProvider === StorageProvider.AWS_S3 ||
            app.storageProvider === StorageProvider.AWS_KINESIS
        ) {
            return {
                result: [],
                from: new Date(),
                to: new Date(),
            };
        }
        return backendDatabaseFactory(app.storageProvider).eventRequests(app, args.query_options);
    });
};
