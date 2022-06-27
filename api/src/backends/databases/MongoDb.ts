import { inject, injectable } from 'inversify';
import BaseDatabase, {
    AppQueryOptions,
    BaseQueryOptions,
    IngestQueryOptions,
} from './abstractions/BaseDatabase';
import TYPES from '../../container/IOC.types';
import App from '../../mongo/models/tag/App';
import IngestEndpoint from '../../mongo/models/data/IngestEndpoint';
import Shell from '../../mongo/database/Shell';
import GenericError from '../../errors/GenericError';
import { LogPriority } from '../../enums/LogPriority';
import { Collection, MongoClient } from 'mongodb';
import { getStorageProviderConfig } from '../../utils/IngestEndpointEnvironmentUtils';
import { MongoDbPushConfig } from '../../Types';
import BaseConfig from '../configuration/abstractions/BaseConfig';
import GQLError from '../../errors/GQLError';
import userMessages from '../../errors/UserMessages';
import BaseLogger from '../logging/abstractions/BaseLogger';
import { WebTrafficType } from '../../enums/WebTrafficType';

@injectable()
export default class MongoDb extends BaseDatabase {
    @inject(TYPES.Shell) protected readonly shell!: Shell;
    @inject(TYPES.BackendConfig) private readonly config!: BaseConfig;
    @inject(TYPES.BackendLogger) private readonly logger!: BaseLogger;

    private mongoConnections: Map<string, MongoClient> = new Map<string, MongoClient>();

    protected readonly MOBILE_TEST: [string, RegExp][] = [
        ['browser_name', /mobile/i],
        ['device_name', /iphone/i],
        ['device_name', /ipad/i],
        ['os_name', /ios/i],
        ['os_name', /android/i],
    ];

    protected readonly BOT_TEST: [string, RegExp][] = [
        ['browser_name', /bot/i],
        ['browser_name', /headless/i],
        ['browser_name', /preview/i],
    ];

    private getAsMobileAggregationRegex() {
        return this.MOBILE_TEST.map(([input, regex]) => {
            return {
                $regexMatch: {
                    input: '$' + input,
                    regex: regex,
                },
            };
        });
    }

    private getAsMobileFilter() {
        return this.MOBILE_TEST.map(([input, regex]) => ({
            [input]: regex,
        }));
    }

    private getAsBotFilter() {
        return this.BOT_TEST.map(([input, regex]) => ({
            [input]: regex,
        }));
    }

    protected async getCollection(entity: App | IngestEndpoint): Promise<Collection> {
        const entityUsageIngestEndpointEnvironmentId =
            this.getEntityUsageIngestEndpointEnvironmentId(entity);
        const mongoConnectionKey =
            entityUsageIngestEndpointEnvironmentId.toString() + entity.storageProviderConfigHash;

        const storageProviderConfig = (await getStorageProviderConfig(
            entityUsageIngestEndpointEnvironmentId,
        )) as MongoDbPushConfig;

        const connectionString = storageProviderConfig.use_api_mongo_server
            ? await this.config.getDatabaseUrl()
            : storageProviderConfig.connection_string;

        const databaseName = storageProviderConfig.use_api_mongo_server
            ? await this.config.getDefaultDatabase()
            : storageProviderConfig.database_name;

        const getMongoConnection = async () => {
            const cachedConnection = this.mongoConnections.get(mongoConnectionKey);
            if (cachedConnection !== undefined) {
                return cachedConnection;
            }

            try {
                const client = new MongoClient(connectionString);
                const connection = await client.connect();
                this.mongoConnections.set(mongoConnectionKey, connection);
                return connection;
            } catch (e) {
                throw new GQLError(
                    userMessages.mongoConnectionStringVerificationFailure(connectionString),
                    true,
                );
            }
        };

        const connection = await getMongoConnection();

        const db = connection.db(databaseName);
        return db.collection(`s8_${entityUsageIngestEndpointEnvironmentId.toString()}`);
    }

    private async runAggregation(
        entity: App | IngestEndpoint,
        pipeline: { [k: string]: any }[],
        limit?: number,
    ): Promise<any[]> {
        //this.logger.info('Pipeline', pipeline).then();
        try {
            const collection = await this.getCollection(entity);
            const aggregation = collection.aggregate(pipeline);
            if (limit !== undefined) {
                aggregation.limit(limit);
            }
            return await aggregation.toArray();
        } catch (e) {
            console.error(e);
            console.debug(JSON.stringify(pipeline));
            return [];
        }
    }

    protected getFormatForTimeSlice(options: BaseQueryOptions): string {
        switch (options.time_slice) {
            case 'YEAR':
                return '%Y';
            case 'MONTH':
                return '%Y-%m';
            case 'DAY':
                return '%Y-%m-%d';
            case 'HOUR':
                return '%Y-%m-%d %H:00:00';
            case 'MINUTE':
                return '%Y-%m-%d %H:%M:00';
        }
        throw new GenericError(
            `Unsupported time slice ${options.time_slice}`,
            LogPriority.DEBUG,
            true,
        );
    }

    protected static getFilterObjectFromStringFilterOption(
        queryOptions: AppQueryOptions,
        filterOptionKey: keyof AppQueryOptions['filter_options'],
        filterKey: string,
    ): { [filterKey: string]: any } | undefined {
        const value = queryOptions.filter_options[filterOptionKey];
        return typeof value === 'string'
            ? {
                  [filterKey]: value == this.NULL_AS_STRING ? null : value,
              }
            : undefined;
    }

    protected getAppFilter(queryOptions: AppQueryOptions): { [p: string]: any } {
        const getRange = () => {
            return {
                dt: {
                    $gte: this.getRangeFromAsDate(queryOptions),
                    $lt: this.getRangeToAsDate(queryOptions),
                },
            };
        };
        const getRevisionFilter = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'revision', 'revision_id');
        const getEnvironmentFilter = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'environment', 'env_id');
        const getEventFilter = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'event', 'event');
        const getEventGroupFilter = () =>
            MongoDb.getFilterObjectFromStringFilterOption(
                queryOptions,
                'event_group',
                'event_group',
            );
        const getUTMSourceFilter = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'utm_source', 'utm_source');
        const getUTMMediumFilter = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'utm_medium', 'utm_medium');
        const getUTMCampaignFilter = () =>
            MongoDb.getFilterObjectFromStringFilterOption(
                queryOptions,
                'utm_campaign',
                'utm_campaign',
            );
        const getUTMTermFilter = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'utm_term', 'utm_term');
        const getUTMContentFilter = () =>
            MongoDb.getFilterObjectFromStringFilterOption(
                queryOptions,
                'utm_content',
                'utm_content',
            );
        const getCountry = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'country', 'user_country');
        const getRegion = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'region', 'user_region');
        const getCity = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'city', 'user_city');
        const getReferrer = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'referrer', 'referrer_url');
        const getReferrerTld = () =>
            MongoDb.getFilterObjectFromStringFilterOption(
                queryOptions,
                'referrer_tld',
                'referrer_tld',
            );
        const getPage = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'page', 'page_url');
        const getMobile = () => {
            if (typeof queryOptions.filter_options.mobile === 'boolean') {
                return queryOptions.filter_options.mobile
                    ? {
                          $or: this.getAsMobileFilter(),
                      }
                    : {
                          $nor: this.getAsMobileFilter(),
                      };
            } else {
                return undefined;
            }
        };
        const getTrafficType = () => {
            if (queryOptions.filter_options.traffic_type === WebTrafficType.BOT) {
                return {
                    $or: this.getAsBotFilter(),
                };
            } else if (queryOptions.filter_options.traffic_type === WebTrafficType.VISITOR) {
                return {
                    $nor: this.getAsBotFilter(),
                };
            } else {
                return undefined;
            }
        };
        const getBrowser = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'browser', 'browser_name');
        const getBrowserVersion = () =>
            MongoDb.getFilterObjectFromStringFilterOption(
                queryOptions,
                'browser_version',
                'browser_version',
            );
        const getScreenSize = () =>
            MongoDb.getFilterObjectFromStringFilterOption(
                queryOptions,
                'screen_size',
                'screen_size',
            );
        const getOS = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'os', 'os_name');
        const getCustomReleaseId = () =>
            MongoDb.getFilterObjectFromStringFilterOption(
                queryOptions,
                'custom_release_id',
                'custom_release_id',
            );
        const getErrorId = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'error_id', 'error_id');
        const getErrorFile = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'error_file', 'error_file');
        const getErrorMessage = () =>
            MongoDb.getFilterObjectFromStringFilterOption(
                queryOptions,
                'error_message',
                'error_message',
            );
        return [
            getRange(),
            getRevisionFilter(),
            getEnvironmentFilter(),
            getEventFilter(),
            getEventGroupFilter(),
            getUTMSourceFilter(),
            getUTMMediumFilter(),
            getUTMCampaignFilter(),
            getUTMTermFilter(),
            getUTMContentFilter(),
            getCountry(),
            getRegion(),
            getCity(),
            getPage(),
            getReferrer(),
            getReferrerTld(),
            getMobile(),
            getTrafficType(),
            getBrowser(),
            getBrowserVersion(),
            getScreenSize(),
            getOS(),
            getCustomReleaseId(),
            getErrorId(),
            getErrorFile(),
            getErrorMessage(),
        ].reduce((a, c) => {
            return c === undefined ? a : Object.assign(a as Record<string, any>, c);
        }, {} as { [k: string]: any }) as { [p: string]: any };
    }

    protected async simpleAppAggregation<T extends string | string[]>(
        app: App,
        queryOptions: AppQueryOptions,
        key: T,
        checkExists = false,
        stringNulls = false,
    ): Promise<{
        result: {
            key: T extends string ? string : { field: string; value: string }[];
            user_count: number;
            event_count: number;
        }[];
        from: Date;
        to: Date;
    }> {
        const getMatch = () => {
            const match = this.getAppFilter(queryOptions);
            if (checkExists) {
                if (typeof key === 'string') {
                    match[key] = { $exists: true };
                } else {
                    key.forEach((_) => (match[_] = { $exists: true }));
                }
            }
            return match;
        };

        const getKey = () => {
            const handleNulls = (k: string) =>
                stringNulls ? { $ifNull: ['$' + k, MongoDb.NULL_AS_STRING] } : '$' + k;
            if (typeof key === 'string') {
                return handleNulls(key);
            } else {
                return key.map((_) => {
                    return {
                        field: _,
                        value: handleNulls(_),
                    };
                });
            }
        };

        const rows = await this.runAggregation(
            app,
            [
                {
                    $match: getMatch(),
                },
                {
                    $project: {
                        _id: 0,
                        key: getKey(),
                        user_hash: 1,
                    },
                },
                {
                    $group: {
                        _id: {
                            key: '$key',
                            user_hash: '$user_hash',
                        },
                        event_count: { $sum: 1 },
                    },
                },
                {
                    $group: {
                        _id: '$_id.key',
                        user_count: { $sum: 1 },
                        event_count: { $sum: '$event_count' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        key: '$_id',
                        user_count: 1,
                        event_count: 1,
                    },
                },
                {
                    $sort: { user_count: -1 },
                },
            ],
            queryOptions.limit,
        );

        return this.getResultWithRange(queryOptions, rows);
    }

    public async errors(app: App, queryOptions: AppQueryOptions) {
        const rows = await this.runAggregation(
            app,
            [
                {
                    $match: {
                        error_id: { $exists: true },
                        error_file: { $exists: true },
                        error_message: { $exists: true },
                        error_column: { $exists: true },
                        error_row: { $exists: true },
                        ...this.getAppFilter(queryOptions),
                    },
                },
                {
                    $project: {
                        _id: 0,
                        error_id: 1,
                        error_file: 1,
                        error_message: 1,
                        error_column: 1,
                        error_trace: { $ifNull: ['$error_trace', 'Undefined'] },
                        error_row: 1,
                        user_hash: 1,
                    },
                },
                {
                    $group: {
                        _id: {
                            error_id: '$error_id',
                            error_file: '$error_file',
                            error_message: '$error_message',
                            error_column: '$error_column',
                            error_row: '$error_row',
                            error_trace: '$error_trace',
                            user_hash: '$user_hash',
                        },
                        event_count: { $sum: 1 },
                    },
                },
                {
                    $group: {
                        _id: {
                            error_id: '$_id.error_id',
                            error_file: '$_id.error_file',
                            error_message: '$_id.error_message',
                            error_column: '$_id.error_column',
                            error_row: '$_id.error_row',
                            error_trace: '$_id.error_trace',
                        },
                        user_count: { $sum: 1 },
                        event_count: { $sum: '$event_count' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        error_id: '$_id.error_id',
                        error_file: '$_id.error_file',
                        error_message: '$_id.error_message',
                        error_column: '$_id.error_column',
                        error_row: '$_id.error_row',
                        error_trace: '$_id.error_trace',
                        user_count: 1,
                        event_count: 1,
                    },
                },
                {
                    $sort: { user_count: -1 },
                },
            ],
            queryOptions.limit,
        );

        return this.getResultWithRange(queryOptions, rows);
    }

    public async averageSessionDuration(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{ result: number; from: Date; to: Date }> {
        const rows = await this.runAggregation(app, [
            {
                $match: this.getAppFilter(queryOptions),
            },
            {
                $project: {
                    ts: { $convert: { input: '$dt', to: 'decimal' } },
                    _id: 0,
                    user_hash: 1,
                },
            },
            {
                $group: {
                    _id: '$user_hash',
                    max: { $min: '$ts' },
                    min: { $max: '$ts' },
                },
            },
            {
                $addFields: {
                    diff: { $subtract: ['$max', '$min'] },
                },
            },
            {
                $match: {
                    diff: { $gt: 0 },
                },
            },
            {
                $group: {
                    _id: null,
                    avg: { $avg: '$diff' },
                },
            },
        ]);

        return this.getResultWithRange(
            queryOptions,
            rows.length > 0 ? Math.round(rows[0]['avg']) : 0,
        );
    }

    public async bounceRatio(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{ result: number; from: Date; to: Date }> {
        const rows = await this.runAggregation(app, [
            {
                $match: this.getAppFilter(queryOptions),
            },
            {
                $project: {
                    _id: 0,
                    user_hash: 1,
                },
            },
            {
                $group: {
                    _id: '$user_hash',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 1,
                    bounce: { $cond: { if: { $eq: ['$count', 1] }, then: 1, else: 0 } },
                },
            },
            {
                $group: {
                    _id: null,
                    bounce: { $avg: '$bounce' },
                },
            },
        ]);

        return this.getResultWithRange(queryOptions, rows.length > 0 ? rows[0]['bounce'] : 0);
    }

    public async eventRequests(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const rows = await this.runAggregation(
            app,
            [
                {
                    $match: this.getAppFilter(queryOptions),
                },
                {
                    $project: {
                        _id: 0,
                        key: {
                            $dateToString: {
                                format: this.getFormatForTimeSlice(queryOptions),
                                date: '$dt',
                            },
                        },
                        user_hash: 1,
                    },
                },
                {
                    $group: {
                        _id: {
                            key: '$key',
                            user_hash: '$user_hash',
                        },
                        event_count: { $sum: 1 },
                    },
                },
                {
                    $group: {
                        _id: '$_id.key',
                        user_count: { $sum: 1 },
                        event_count: { $sum: '$event_count' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        key: '$_id',
                        user_count: 1,
                        event_count: 1,
                    },
                },
                {
                    $sort: { user_count: -1 },
                },
            ],
            queryOptions.limit,
        );

        return this.getResultWithRange(queryOptions, rows);
    }

    public async referrers(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const rows = await this.runAggregation(
            app,
            [
                {
                    $match: { referrer_url: { $exists: true }, ...this.getAppFilter(queryOptions) },
                },
                {
                    $project: {
                        _id: 0,
                        dt: 1,
                        referrer_url: 1,
                        user_hash: 1,
                    },
                },
                {
                    $sort: {
                        dt: -1,
                    },
                },
                {
                    $group: {
                        _id: '$user_hash',
                        referrer: { $first: '$referrer_url' },
                        event_count: { $sum: 1 },
                    },
                },
                {
                    $group: {
                        _id: '$referrer',
                        user_count: { $sum: 1 },
                        event_count: { $sum: '$event_count' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        key: '$_id',
                        user_count: 1,
                        event_count: 1,
                    },
                },
                {
                    $sort: { user_count: -1 },
                },
            ],
            queryOptions.limit,
        );

        return this.getResultWithRange(queryOptions, rows);
    }

    public async referrerTlds(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const rows = await this.runAggregation(
            app,
            [
                {
                    $match: { referrer_tld: { $exists: true }, ...this.getAppFilter(queryOptions) },
                },
                {
                    $project: {
                        _id: 0,
                        referrer_tld: 1,
                        user_hash: 1,
                    },
                },
                {
                    $group: {
                        _id: {
                            user_hash: '$user_hash',
                            referrer_tld: '$referrer_tld',
                        },
                        event_count: { $sum: 1 },
                    },
                },
                {
                    $group: {
                        _id: '$_id.referrer_tld',
                        user_count: { $sum: 1 },
                        event_count: { $sum: '$event_count' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        key: '$_id',
                        user_count: 1,
                        event_count: 1,
                    },
                },
                {
                    $sort: { user_count: -1 },
                },
            ],
            queryOptions.limit,
        );

        return this.getResultWithRange(queryOptions, rows);
    }

    public async utms(
        app: App,
        queryOptions: AppQueryOptions,
        utmFilter: 'MEDIUM' | 'SOURCE' | 'CAMPAIGN',
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const getUTMKey = () => {
            if (utmFilter === 'MEDIUM') {
                return 'utm_medium';
            } else if (utmFilter === 'SOURCE') {
                return 'utm_source';
            } else if (utmFilter === 'CAMPAIGN') {
                return 'utm_campaign';
            } else {
                throw new GenericError(
                    'UTM filter provided is not currently supported',
                    LogPriority.ERROR,
                );
            }
        };
        return this.simpleAppAggregation(app, queryOptions, getUTMKey(), true);
    }

    public async pages(
        app: App,
        queryOptions: AppQueryOptions,
        pageFilter?: 'ENTRY' | 'EXIT',
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const getPipeline = () => {
            if (pageFilter === undefined) {
                return [
                    {
                        $match: { page_url: { $exists: true }, ...this.getAppFilter(queryOptions) },
                    },
                    {
                        $project: {
                            _id: 0,
                            dt: 1,
                            page_url: 1,
                            user_hash: 1,
                        },
                    },
                    {
                        $sort: {
                            dt: -1,
                        },
                    },
                    {
                        $group: {
                            _id: {
                                key: '$page_url',
                                user_hash: '$user_hash',
                            },
                            event_count: { $sum: 1 },
                        },
                    },
                    {
                        $group: {
                            _id: '$_id.key',
                            user_count: { $sum: 1 },
                            event_count: { $sum: '$event_count' },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            key: '$_id',
                            user_count: 1,
                            event_count: 1,
                        },
                    },
                    {
                        $sort: { user_count: -1 },
                    },
                ];
            } else {
                return [
                    {
                        $match: { page_url: { $exists: true }, ...this.getAppFilter(queryOptions) },
                    },
                    {
                        $project: {
                            _id: 0,
                            dt: 1,
                            page_url: 1,
                            user_hash: 1,
                        },
                    },
                    {
                        $sort: {
                            dt: -1,
                        },
                    },
                    {
                        $group: {
                            _id: '$user_hash',
                            page_url:
                                pageFilter === 'ENTRY'
                                    ? { $first: '$page_url' }
                                    : { $last: '$page_url' },
                            event_count: { $sum: 1 },
                        },
                    },
                    {
                        $group: {
                            _id: '$page_url',
                            user_count: { $sum: 1 },
                            event_count: { $sum: '$event_count' },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            key: '$_id',
                            user_count: 1,
                            event_count: 1,
                        },
                    },
                    {
                        $sort: { user_count: -1 },
                    },
                ];
            }
        };

        const rows = await this.runAggregation(app, getPipeline(), queryOptions.limit);

        return this.getResultWithRange(queryOptions, rows);
    }

    public async countries(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        return this.simpleAppAggregation(app, queryOptions, 'user_country', false, true);
    }

    public async regions(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        return this.simpleAppAggregation(app, queryOptions, 'user_region', false, true);
    }

    public async cities(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        return this.simpleAppAggregation(app, queryOptions, 'user_city', false, true);
    }

    public async devices(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const rows = await this.runAggregation(
            app,
            [
                {
                    $match: { ...this.getAppFilter(queryOptions) },
                },
                {
                    $project: {
                        _id: 0,
                        key: {
                            $cond: {
                                if: { $or: this.getAsMobileAggregationRegex() },
                                then: 'Mobile',
                                else: 'Desktop',
                            },
                        },
                        user_hash: 1,
                    },
                },
                {
                    $group: {
                        _id: {
                            key: '$key',
                            user_hash: '$user_hash',
                        },
                        event_count: { $sum: 1 },
                    },
                },
                {
                    $group: {
                        _id: '$_id.key',
                        user_count: { $sum: 1 },
                        event_count: { $sum: '$event_count' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        key: '$_id',
                        user_count: 1,
                        event_count: 1,
                    },
                },
                {
                    $sort: { user_count: -1 },
                },
            ],
            queryOptions.limit,
        );

        return this.getResultWithRange(queryOptions, rows);
    }

    public async eventGroups(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        return this.simpleAppAggregation(app, queryOptions, 'event_group', true);
    }

    public async events(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        return this.simpleAppAggregation(app, queryOptions, 'event');
    }

    public async browsers(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        return this.simpleAppAggregation(app, queryOptions, 'browser_name');
    }

    public async browserVersions(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: {
            key: { field: string; value: string }[];
            user_count: number;
            event_count: number;
        }[];
        from: Date;
        to: Date;
    }> {
        return this.simpleAppAggregation(
            app,
            queryOptions,
            ['browser_name', 'browser_version'],
            false,
            true,
        );
    }

    public async screenSizes(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        return this.simpleAppAggregation(app, queryOptions, 'screen_size', false, true);
    }

    public async operatingSystems(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        return this.simpleAppAggregation(app, queryOptions, 'os_name');
    }

    protected getIngestEndpointFilter(queryOptions: AppQueryOptions): { [p: string]: any } {
        const getRange = () => {
            return {
                dt: {
                    $gte: this.getRangeFromAsDate(queryOptions),
                    $lt: this.getRangeToAsDate(queryOptions),
                },
            };
        };
        const getRevisionFilter = () =>
            MongoDb.getFilterObjectFromStringFilterOption(queryOptions, 'revision', 'revision_id');
        const getEnvironmentFilter = () =>
            MongoDb.getFilterObjectFromStringFilterOption(
                queryOptions,
                'environment',
                'environment_id',
            );

        return [getRange(), getRevisionFilter(), getEnvironmentFilter()].reduce((a, c) => {
            return c === undefined ? a : Object.assign(a as Record<string, any>, c);
        }, {} as { [k: string]: any }) as { [p: string]: any };
    }

    public async simpleIngestSum(
        ingestEndpoint: IngestEndpoint,
        queryOptions: IngestQueryOptions,
        key: string,
    ): Promise<{ result: { key: string; count: number }[]; from: Date; to: Date }> {
        const rows = await this.runAggregation(
            ingestEndpoint,
            [
                {
                    $match: this.getIngestEndpointFilter(queryOptions),
                },
                {
                    $project: {
                        _id: 0,
                        key: {
                            $dateToString: {
                                format: this.getFormatForTimeSlice(queryOptions),
                                date: '$dt',
                            },
                        },
                        count: '$' + key,
                    },
                },
                {
                    $group: {
                        _id: '$key',
                        count: { $sum: '$count' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        key: '$_id',
                        count: 1,
                    },
                },
                {
                    $sort: { key: -1 },
                },
            ],
            queryOptions.limit,
        );

        return this.getResultWithRange(queryOptions, rows);
    }

    public async appBillingCycleUsage(
        app: App,
        cycleStart: Date,
        cycleEnd: Date,
    ): Promise<{ result: number; from: Date; to: Date }> {
        //MongoDB is not used for the commercial version...
        return {
            result: 0,
            from: cycleStart,
            to: cycleEnd,
        };
    }

    public async ingestBillingCycleUsage(
        ingestEndpoint: IngestEndpoint,
        cycleStart: Date,
        cycleEnd: Date,
    ): Promise<{ result: { request_count: number; byte_count: number }; from: Date; to: Date }> {
        //MongoDB is not used for the commercial version...
        return {
            result: {
                request_count: 0,
                byte_count: 0,
            },
            from: cycleStart,
            to: cycleEnd,
        };
    }

    public async requests(
        ingestEndpoint: IngestEndpoint,
        queryOptions: IngestQueryOptions,
    ): Promise<{ result: { key: string; count: number }[]; from: Date; to: Date }> {
        return this.simpleIngestSum(ingestEndpoint, queryOptions, 'requests');
    }

    public async bytes(
        ingestEndpoint: IngestEndpoint,
        queryOptions: IngestQueryOptions,
    ): Promise<{ result: { key: string; count: number }[]; from: Date; to: Date }> {
        return this.simpleIngestSum(ingestEndpoint, queryOptions, 'bytes');
    }
}
