import container from '../container/IOC.config';
import TYPES from '../container/IOC.types';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TagManagerAccount from '../mongo/models/tag/TagManagerAccount';
import App from '../mongo/models/tag/App';
import { endOfDay, parse, startOfDay } from 'date-fns';
import Usage from '../mongo/models/Usage';
import DataManagerAccount from '../mongo/models/data/DataManagerAccount';
import IngestEndpoint from '../mongo/models/data/IngestEndpoint';
import { AccountType } from '../enums/AccountType';
import { getUsageCycle } from '../utils/UsageUtils';
import BaseDatabase from '../backends/databases/abstractions/BaseDatabase';
import BaseLogger from '../backends/logging/abstractions/BaseLogger';
import { StorageProvider } from '../enums/StorageProvider';

const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
const backendDatabaseFactory = container.get<(storage_provider: StorageProvider) => BaseDatabase>(
    TYPES.BackendDatabaseFactory,
);
const logger = container.get<BaseLogger>(TYPES.BackendLogger);

const updateTagManagerUsage = async () => {
    const accounts = await repoFactory(TagManagerAccount).find({});
    await Promise.all(
        accounts.map(async (account) => {
            const usageCycle = await getUsageCycle(account);
            logger.info(`Processing tag manager account ${account.id}`).then();
            if (usageCycle !== undefined) {
                logger.info(`Usage cycle ${usageCycle.start} -> ${usageCycle.end}`).then();
                const apps = await repoFactory(App).find({
                    _tag_manager_account_id: account.id,
                });
                const dayUsage = (
                    await Promise.all(
                        apps.map((app) =>
                            backendDatabaseFactory(app.storageProvider).eventRequests(app, {
                                time_slice: 'DAY',
                                filter_options: {
                                    from: startOfDay(usageCycle.start).getTime(),
                                    to: endOfDay(usageCycle.end).getTime(),
                                },
                                limit: 1000,
                            }),
                        ),
                    )
                ).reduce((v: { [k: string]: number }, appDayUsage) => {
                    appDayUsage.result.forEach((_) => {
                        v[_.key] =
                            v[_.key] === undefined ? _.event_count : v[_.key] + _.event_count;
                    });
                    return v;
                }, {});
                await Promise.all(
                    Object.entries(dayUsage).map(async (_) => {
                        const [dayString, value] = _;
                        const day = parse(dayString, 'yyyy-MM-dd', new Date());
                        const usage = await repoFactory(Usage).findOne({
                            _usage_entity_id: account.id,
                            _day: day,
                        });
                        if (usage === null) {
                            //create a reference...
                            await repoFactory(Usage).save(new Usage(account, day, value), 'SYSTEM');
                        } else {
                            usage.requests = value;
                            await repoFactory(Usage).save(usage, 'SYSTEM');
                        }
                    }),
                );
            } else {
                logger.info('No usage cycle found, account must not be active').then();
            }
        }),
    );
};

const updateDataManagerUsage = async () => {
    const accounts = await repoFactory(DataManagerAccount).find({
        _account_type: AccountType.USER,
    });
    await Promise.all(
        accounts.map(async (account) => {
            const usageCycle = await getUsageCycle(account);
            logger.info(`Processing data manager account ${account.id}`).then();
            if (usageCycle !== undefined) {
                logger.info(`Usage cycle ${usageCycle.start} -> ${usageCycle.end}`).then();
                const ingestEndpoints = await repoFactory(IngestEndpoint).find({
                    _data_manager_account_id: account.id,
                });
                const dayUsage = (
                    await Promise.all(
                        ingestEndpoints.map((ingestEndpoint) =>
                            backendDatabaseFactory(ingestEndpoint.storageProvider).usage(
                                ingestEndpoint,
                                {
                                    time_slice: 'DAY',
                                    filter_options: {
                                        from: startOfDay(usageCycle.start).getTime(),
                                        to: endOfDay(usageCycle.end).getTime(),
                                    },
                                    limit: 1000,
                                },
                            ),
                        ),
                    )
                ).reduce(
                    (v: { [k: string]: { requests: number; bytes: number } }, ingestDayUsage) => {
                        ingestDayUsage.result.forEach((_) => {
                            if (v[_.key] === undefined) {
                                v[_.key] = {
                                    requests: _.requests,
                                    bytes: _.bytes,
                                };
                            } else {
                                v[_.key] = {
                                    requests: v[_.key].requests + _.requests,
                                    bytes: v[_.key].bytes + _.bytes,
                                };
                            }
                        });
                        return v;
                    },
                    {},
                );
                await Promise.all(
                    Object.entries(dayUsage).map(async (_) => {
                        const [dayString, value] = _;
                        const day = parse(dayString, 'yyyy-MM-dd', new Date());
                        const usage = await repoFactory(Usage).findOne({
                            _usage_entity_id: account.id,
                            _day: day,
                        });
                        if (usage === null) {
                            //create a reference...
                            await repoFactory(Usage).save(
                                new Usage(account, day, value.requests, value.bytes),
                                'SYSTEM',
                            );
                        } else {
                            usage.requests = value.requests;
                            usage.bytes = value.bytes;
                            await repoFactory(Usage).save(usage, 'SYSTEM');
                        }
                    }),
                );
            } else {
                logger.info(`No usage cycle found, account must not be active`).then();
            }
        }),
    );
};

export const updateUsageJob = {
    name: 'UpdateUsage',
    job: async () => {
        await updateTagManagerUsage();
        await updateDataManagerUsage();
    },
};
