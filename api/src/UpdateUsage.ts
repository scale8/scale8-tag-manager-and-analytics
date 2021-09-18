import dotenv from 'dotenv';
import container from './container/IOC.config';
import Shell from './mongo/database/Shell';
import TYPES from './container/IOC.types';
import { inject, injectable } from 'inversify';
import RepoFromModelFactory from './container/factoryTypes/RepoFromModelFactory';
import TagManagerAccount from './mongo/models/tag/TagManagerAccount';
import App from './mongo/models/tag/App';
import { endOfDay, parse, startOfDay } from 'date-fns';
import Usage from './mongo/models/Usage';
import OperationOwner from './enums/OperationOwner';
import DataManagerAccount from './mongo/models/data/DataManagerAccount';
import IngestEndpoint from './mongo/models/data/IngestEndpoint';
import { AccountType } from './enums/AccountType';
import { getUsageCycle } from './utils/UsageUtils';
import BaseDatabase from './backends/databases/abstractions/BaseDatabase';
import BaseLogger from './backends/logging/abstractions/BaseLogger';
import { StorageProvider } from './enums/StorageProvider';

//register .env as soon as possible...
dotenv.config();

@injectable()
class UpdateUsage {
    @inject(TYPES.RepoFromModelFactory) protected readonly repoFactory!: RepoFromModelFactory;
    @inject(TYPES.BackendLogger) protected readonly logger!: BaseLogger;
    @inject(TYPES.BackendDatabaseFactory)
    protected readonly backendDatabaseFactory!: (storage_provider: StorageProvider) => BaseDatabase;

    public async updateTagManagerUsage() {
        const accounts = await this.repoFactory(TagManagerAccount).find({});
        await Promise.all(
            accounts.map(async (account) => {
                const usageCycle = await getUsageCycle(account);
                console.log(`Processing tag manager account ${account.id}`);
                if (usageCycle !== undefined) {
                    console.log(`Usage cycle ${usageCycle.start} -> ${usageCycle.end}`);
                    const apps = await this.repoFactory(App).find({
                        _tag_manager_account_id: account.id,
                    });
                    const dayUsage = (
                        await Promise.all(
                            apps.map((app) =>
                                this.backendDatabaseFactory(app.storageProvider).eventRequests(
                                    app,
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
                            const usage = await this.repoFactory(Usage).findOne({
                                _usage_entity_id: account.id,
                                _day: day,
                            });
                            if (usage === null) {
                                //create a reference...
                                await this.repoFactory(Usage).save(
                                    new Usage(account, day, value),
                                    'SYSTEM',
                                    OperationOwner.SYSTEM,
                                );
                            } else {
                                usage.requests = value;
                                await this.repoFactory(Usage).save(
                                    usage,
                                    'SYSTEM',
                                    OperationOwner.SYSTEM,
                                );
                            }
                        }),
                    );
                } else {
                    console.log(`No usage cycle found, account must not be active`);
                }
            }),
        );
    }

    public async updateDataManagerUsage() {
        const accounts = await this.repoFactory(DataManagerAccount).find({
            _account_type: AccountType.USER,
        });
        await Promise.all(
            accounts.map(async (account) => {
                const usageCycle = await getUsageCycle(account);
                console.log(`Processing data manager account ${account.id}`);
                if (usageCycle !== undefined) {
                    console.log(`Usage cycle ${usageCycle.start} -> ${usageCycle.end}`);
                    const ingestEndpoints = await this.repoFactory(IngestEndpoint).find({
                        _data_manager_account_id: account.id,
                    });
                    const dayUsage = (
                        await Promise.all(
                            ingestEndpoints.map((ingestEndpoint) =>
                                this.backendDatabaseFactory(ingestEndpoint.storageProvider).usage(
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
                        (
                            v: { [k: string]: { requests: number; bytes: number } },
                            ingestDayUsage,
                        ) => {
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
                            const usage = await this.repoFactory(Usage).findOne({
                                _usage_entity_id: account.id,
                                _day: day,
                            });
                            if (usage === null) {
                                //create a reference...
                                await this.repoFactory(Usage).save(
                                    new Usage(account, day, value.requests, value.bytes),
                                    'SYSTEM',
                                    OperationOwner.SYSTEM,
                                );
                            } else {
                                usage.requests = value.requests;
                                usage.bytes = value.bytes;
                                await this.repoFactory(Usage).save(
                                    usage,
                                    'SYSTEM',
                                    OperationOwner.SYSTEM,
                                );
                            }
                        }),
                    );
                } else {
                    console.log(`No usage cycle found, account must not be active`);
                }
            }),
        );
    }
}

(async () => {
    try {
        await container.resolve(UpdateUsage).updateTagManagerUsage();
        await container.resolve(UpdateUsage).updateDataManagerUsage();
    } catch (e) {
        console.error(e);
    } finally {
        //kill connections...
        const mongo = container.get<Shell>(TYPES.Shell);
        await mongo.disconnect();
        process.exit(0);
    }
})();
