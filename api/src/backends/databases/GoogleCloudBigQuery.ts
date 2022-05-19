import { inject, injectable } from 'inversify';
import BaseDatabase, {
    AppQueryOptions,
    BaseQueryOptions,
    IngestQueryOptions,
} from './abstractions/BaseDatabase';
import App from '../../mongo/models/tag/App';
import IngestEndpoint from '../../mongo/models/data/IngestEndpoint';
import { format, isAfter, sub } from 'date-fns';
import GenericError from '../../errors/GenericError';
import { BigQuery } from '@google-cloud/bigquery';
import { LogPriority } from '../../enums/LogPriority';
import TYPES from '../../container/IOC.types';
import BaseConfig from '../configuration/abstractions/BaseConfig';
import BaseLogger from '../logging/abstractions/BaseLogger';
import { getStorageProviderConfig } from '../../utils/IngestEndpointEnvironmentUtils';
import { GCBigQueryStreamConfig } from '../../Types';
import { getBigQueryConfig, getServiceAccountJson } from '../../utils/GoogleCloudUtils';

@injectable()
export default class GoogleCloudBigQuery extends BaseDatabase {
    @inject(TYPES.BackendConfig) private readonly config!: BaseConfig;
    @inject(TYPES.BackendLogger) private readonly logger!: BaseLogger;

    private bigQueryInstances: Map<string, BigQuery> = new Map<string, BigQuery>();

    protected async getBigQuery(entity: App | IngestEndpoint) {
        const entityUsageIngestEndpointEnvironmentId =
            this.getEntityUsageIngestEndpointEnvironmentId(entity);

        const bigQueryInstanceKey =
            entityUsageIngestEndpointEnvironmentId.toString() + entity.storageProviderConfigHash;

        const cachedInstance = this.bigQueryInstances.get(bigQueryInstanceKey);
        if (cachedInstance !== undefined) {
            return cachedInstance;
        }

        const getBigQuery = async (): Promise<BigQuery> => {
            const serviceAccountJson = await getServiceAccountJson(
                entityUsageIngestEndpointEnvironmentId,
            );

            return new BigQuery({
                projectId: serviceAccountJson.project_id,
                credentials: {
                    client_email: serviceAccountJson.client_email,
                    private_key: serviceAccountJson.private_key,
                },
            });
        };

        const bigQuery = await getBigQuery();

        this.bigQueryInstances.set(bigQueryInstanceKey, bigQuery);

        return bigQuery;
    }

    protected readonly MOBILE_TEST =
        '(INSTR(browser_name, "Mobile") > 0 OR device_name = "iPhone" OR device_name = "iPad" OR os_name = "iOS" OR os_name = "Android")';

    protected async query(
        entity: App | IngestEndpoint,
        query: string,
        params?: { [p: string]: any },
    ): Promise<any[]> {
        const bq = await this.getBigQuery(entity);

        try {
            const [job] = await bq.createQueryJob({
                query: query.trim(),
                location: await this.getLocation(entity),
                params: params,
            });
            const [rows] = await job.getQueryResults();
            return rows;
        } catch (e: any) {
            this.logger.warn(e.message, e).then();
            return [];
        }
    }

    protected async getLocation(entity: App | IngestEndpoint): Promise<string> {
        const entityUsageIngestEndpointEnvironmentId =
            this.getEntityUsageIngestEndpointEnvironmentId(entity);
        return this.config.isCommercial()
            ? 'EU'
            : (
                  (await getStorageProviderConfig(
                      entityUsageIngestEndpointEnvironmentId,
                  )) as GCBigQueryStreamConfig
              ).data_set_location;
    }

    protected async getTable(entity: App | IngestEndpoint): Promise<string> {
        const entityUsageIngestEndpointEnvironmentId =
            this.getEntityUsageIngestEndpointEnvironmentId(entity);
        const bigQueryConfig = await getBigQueryConfig(entityUsageIngestEndpointEnvironmentId);

        return `\`${bigQueryConfig.service_account_json.project_id}.${
            bigQueryConfig.data_set_name
        }.s8_${entityUsageIngestEndpointEnvironmentId.toString()}_*\``;
    }

    protected getRangeFrom(options: BaseQueryOptions): string {
        return format(options.filter_options.from, 'yyyy-MM-dd HH:mm:ss');
    }

    protected getRangeTo(options: BaseQueryOptions): string {
        return format(options.filter_options.to, 'yyyy-MM-dd HH:mm:ss');
    }

    protected getPartitionWindowFrom(options: BaseQueryOptions): string {
        return format(options.filter_options.from, 'yyyy-MM-dd');
    }

    protected getPartitionWindowTo(options: BaseQueryOptions): string {
        return format(options.filter_options.to, 'yyyy-MM-dd');
    }

    protected includeBuffer(options: BaseQueryOptions): boolean {
        return isAfter(
            options.filter_options.to,
            sub(new Date(), {
                days: 1,
                hours: 1,
            }),
        );
    }

    protected generateRange(options: BaseQueryOptions): string {
        const partitionRange = `DATE(_PARTITIONTIME) >= "${this.getPartitionWindowFrom(
            options,
        )}" AND DATE(_PARTITIONTIME) <= "${this.getPartitionWindowTo(options)}"`;
        const filterRange = `dt >= "${this.getRangeFrom(options)}" AND dt < "${this.getRangeTo(
            options,
        )}"`;
        return this.includeBuffer(options)
            ? `((${partitionRange}) OR DATE(_PARTITIONTIME) IS NULL) AND ${filterRange}`
            : `(${partitionRange} AND ${filterRange})`;
    }

    protected getLimit(options: BaseQueryOptions): string {
        return 'LIMIT ' + options.limit;
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

    protected getAppFilter(queryOptions: AppQueryOptions): {
        where: string;
        params: { [k: string]: any };
    } {
        const getRevisionFilter = () =>
            typeof queryOptions.filter_options.revision === 'string'
                ? {
                      where: 'revision_id = @revision_id',
                      params: { revision_id: queryOptions.filter_options.revision },
                  }
                : undefined;
        const getEnvironmentFilter = () =>
            typeof queryOptions.filter_options.environment === 'string'
                ? {
                      where: 'env_id = @environment_id',
                      params: { environment_id: queryOptions.filter_options.environment },
                  }
                : undefined;
        const getEventFilter = () =>
            typeof queryOptions.filter_options.event === 'string'
                ? {
                      where: 'event = @event',
                      params: { event: queryOptions.filter_options.event },
                  }
                : undefined;
        const getEventGroupFilter = () =>
            typeof queryOptions.filter_options.event_group === 'string'
                ? {
                      where: 'event_group = @event_group',
                      params: { event_group: queryOptions.filter_options.event_group },
                  }
                : undefined;
        const getUTMSourceFilter = () =>
            typeof queryOptions.filter_options.utm_source === 'string'
                ? {
                      where: 'utm_source = @utm_source',
                      params: { utm_source: queryOptions.filter_options.utm_source },
                  }
                : undefined;
        const getUTMMediumFilter = () =>
            typeof queryOptions.filter_options.utm_medium === 'string'
                ? {
                      where: 'utm_medium = @utm_medium',
                      params: { utm_medium: queryOptions.filter_options.utm_medium },
                  }
                : undefined;
        const getUTMCampaignFilter = () =>
            typeof queryOptions.filter_options.utm_campaign === 'string'
                ? {
                      where: 'utm_campaign = @utm_campaign',
                      params: { utm_campaign: queryOptions.filter_options.utm_campaign },
                  }
                : undefined;
        const getUTMTermFilter = () =>
            typeof queryOptions.filter_options.utm_term === 'string'
                ? {
                      where: 'utm_term = @utm_term',
                      params: { utm_term: queryOptions.filter_options.utm_term },
                  }
                : undefined;
        const getUTMContentFilter = () =>
            typeof queryOptions.filter_options.utm_content === 'string'
                ? {
                      where: 'utm_content = @utm_content',
                      params: { utm_content: queryOptions.filter_options.utm_content },
                  }
                : undefined;
        const getCountry = () =>
            typeof queryOptions.filter_options.country === 'string'
                ? {
                      where: 'user_country = @country',
                      params: { country: queryOptions.filter_options.country },
                  }
                : undefined;
        const getReferrer = () =>
            typeof queryOptions.filter_options.referrer === 'string'
                ? {
                      where: 'referrer_url LIKE @referrer',
                      params: { referrer: queryOptions.filter_options.referrer },
                  }
                : undefined;
        const getReferrerTld = () =>
            typeof queryOptions.filter_options.referrer_tld === 'string'
                ? {
                      where: 'REPLACE(FORMAT("%T", NET.REG_DOMAIN(referrer_url)), "\\"", "") = @referrer_tld',
                      params: { referrer_tld: queryOptions.filter_options.referrer_tld },
                  }
                : undefined;
        const getPage = () =>
            typeof queryOptions.filter_options.page === 'string'
                ? {
                      where: 'page_url LIKE @page',
                      params: { page: queryOptions.filter_options.page },
                  }
                : undefined;
        const getMobile = () => {
            if (
                typeof queryOptions.filter_options.mobile === 'boolean' &&
                queryOptions.filter_options.mobile
            ) {
                return {
                    where: this.MOBILE_TEST,
                    params: { mobile: queryOptions.filter_options.mobile },
                };
            } else if (
                typeof queryOptions.filter_options.mobile === 'boolean' &&
                !queryOptions.filter_options.mobile
            ) {
                return {
                    where: 'NOT ' + this.MOBILE_TEST,
                    params: { mobile: queryOptions.filter_options.mobile },
                };
            } else {
                return undefined;
            }
        };
        const getBrowser = () =>
            typeof queryOptions.filter_options.browser === 'string'
                ? {
                      where: 'browser_name = @browser',
                      params: { browser: queryOptions.filter_options.browser },
                  }
                : undefined;
        const getOS = () =>
            typeof queryOptions.filter_options.os === 'string'
                ? {
                      where: 'os_name = @os',
                      params: { os: queryOptions.filter_options.os },
                  }
                : undefined;
        const getCustomReleaseId = () =>
            typeof queryOptions.filter_options.custom_release_id === 'string'
                ? {
                      where: 'custom_release_id = @custom_release_id',
                      params: { custom_release_id: queryOptions.filter_options.custom_release_id },
                  }
                : undefined;
        const getErrorId = () =>
            typeof queryOptions.filter_options.error_id === 'string'
                ? {
                      where: 'error_id = @error_id',
                      params: { error_id: queryOptions.filter_options.error_id },
                  }
                : undefined;
        const getErrorFile = () =>
            typeof queryOptions.filter_options.error_file === 'string'
                ? {
                      where: 'error_file = @error_file',
                      params: { error_file: queryOptions.filter_options.error_file },
                  }
                : undefined;
        const getErrorMessage = () =>
            typeof queryOptions.filter_options.error_message === 'string'
                ? {
                      where: 'error_message = @error_message',
                      params: { error_message: queryOptions.filter_options.error_message },
                  }
                : undefined;

        const replaceStringNullsAsNulls = (params: { [k: string]: any }) =>
            Object.keys(params).reduce((o, k) => {
                o[k] = params[k] == GoogleCloudBigQuery.NULL_AS_STRING ? null : params[k];
                return o;
            }, {} as { [k: string]: any });

        return [
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
            getPage(),
            getReferrer(),
            getReferrerTld(),
            getMobile(),
            getBrowser(),
            getOS(),
            getCustomReleaseId(),
            getErrorId(),
            getErrorFile(),
            getErrorMessage(),
        ].reduce(
            (a, c) => {
                if (c === undefined) {
                    return a;
                } else {
                    return {
                        where: a.where + ' AND ' + c.where,
                        params: {
                            ...replaceStringNullsAsNulls(a.params),
                            ...replaceStringNullsAsNulls(c.params),
                        },
                    };
                }
            },
            {
                where: this.generateRange(queryOptions),
                params: {},
            },
        );
    }

    public async errors(app: App, queryOptions: AppQueryOptions) {
        const filter = this.getAppFilter(queryOptions);

        const query = `
            SELECT
              error_id,
              error_file,
              error_message,
              error_column,
              error_row,
              IF(error_trace IS NULL, 'Undefined', error_trace) as error_trace,
              COUNT(DISTINCT user_hash) AS user_count,
              SUM(1) AS event_count
            FROM
              ${await this.getTable(app)}
            WHERE
              ${filter.where}
              AND error_id IS NOT NULL
              AND error_file IS NOT NULL
              AND error_message IS NOT NULL
              AND error_column IS NOT NULL
              AND error_row IS NOT NULL
            GROUP BY
              error_id,
              error_file,
              error_message,
              error_column,
              error_row,
              error_trace
            ORDER BY
              user_count DESC
            ${this.getLimit(queryOptions)}
        `;

        return this.getResultWithRange(queryOptions, await this.query(app, query, filter.params));
    }

    public async averageSessionDuration(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{ result: number; from: Date; to: Date }> {
        const filter = this.getAppFilter(queryOptions);
        const query = `
                        SELECT
                          AVG(time_diff) as duration
                        FROM (
                            SELECT
                              user_hash,
                              DATETIME_DIFF(MAX(dt), MIN(dt), SECOND) AS time_diff
                            FROM
                              ${await this.getTable(app)}
                            WHERE
                              ${filter.where}
                            GROUP BY user_hash
                            HAVING time_diff > 0
                        )
                    `.trim();

        const rows = await this.query(app, query, filter.params);

        return this.getResultWithRange(
            queryOptions,
            rows.length > 0 ? Math.round(rows[0]['duration']) : 0,
        );
    }

    public async bounceRatio(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{ result: number; from: Date; to: Date }> {
        const filter = this.getAppFilter(queryOptions);
        const query = `
                        SELECT
                          SUM(IF(count = 1,1,0)) / SUM(count) AS bounce_ratio
                        FROM (
                            SELECT
                              user_hash,
                              SUM(1) AS count,
                            FROM
                              ${await this.getTable(app)}
                            WHERE
                               ${filter.where}
                            GROUP BY user_hash
                        )
                    `.trim();

        const rows = await this.query(app, query, filter.params);
        return this.getResultWithRange(
            queryOptions,
            rows.length > 0 ? Math.round(rows[0]['bounce_ratio']) : 0,
        );
    }

    public async eventRequests(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const filter = this.getAppFilter(queryOptions);
        const query = `
                        SELECT
                          FORMAT_DATETIME("${this.getFormatForTimeSlice(queryOptions)}", dt) AS key,
                          COUNT(DISTINCT user_hash) AS user_count,
                          SUM(1) AS event_count,
                        FROM
                          ${await this.getTable(app)}
                        WHERE
                          ${filter.where}
                        GROUP BY
                          key
                        ORDER BY
                          user_count DESC
                        ${this.getLimit(queryOptions)}
                    `.trim();

        return this.getResultWithRange(queryOptions, await this.query(app, query, filter.params));
    }

    public async referrers(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const filter = this.getAppFilter(queryOptions);

        const query = `
            SELECT
              referrer_url AS key,
              COUNT(DISTINCT user_hash) AS user_count,
              SUM(1) AS event_count,
            FROM (
              SELECT
                user_hash AS uh,
                MIN(dt) AS first_dt,
              FROM
                ${await this.getTable(app)}
              WHERE
                ${filter.where}
              GROUP BY
                user_hash ) AS fq
            JOIN
              ${await this.getTable(app)} AS ds
            ON
              fq.uh = ds.user_hash
              AND fq.first_dt = ds.dt
            WHERE
              ${filter.where}
              AND referrer_url <> ""
            GROUP BY
              key
            ORDER BY
              user_count DESC
            ${this.getLimit(queryOptions)}
        `;

        return this.getResultWithRange(queryOptions, await this.query(app, query, filter.params));
    }

    public async referrerTlds(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const filter = this.getAppFilter(queryOptions);

        const query = `
            SELECT
              REPLACE(FORMAT("%T", NET.REG_DOMAIN(referrer_url)), "\\"", "") AS key,
              COUNT(DISTINCT user_hash) AS user_count,
              SUM(1) AS event_count,
            FROM (
              SELECT
                user_hash AS uh,
                MIN(dt) AS first_dt,
              FROM
                ${await this.getTable(app)}
              WHERE
                ${filter.where}
              GROUP BY
                user_hash ) AS fq
            JOIN
              ${await this.getTable(app)} AS ds
            ON
              fq.uh = ds.user_hash
              AND fq.first_dt = ds.dt
            WHERE
              ${filter.where}
              AND referrer_url <> ""
            GROUP BY
              key
            ORDER BY
              user_count DESC
            ${this.getLimit(queryOptions)}
        `;

        return this.getResultWithRange(queryOptions, await this.query(app, query, filter.params));
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
        const filter = this.getAppFilter(queryOptions);

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

        const utmKey = getUTMKey();

        const query = `
                    SELECT
                      ${utmKey} AS key,
                      COUNT(DISTINCT user_hash) AS user_count,
                      SUM(1) AS event_count,
                    FROM
                      ${await this.getTable(app)}
                    WHERE
                      ${filter.where}
                      AND ${utmKey} <> ""
                    GROUP BY
                      key
                    ORDER BY
                      user_count DESC
                    ${this.getLimit(queryOptions)}
                `;

        return this.getResultWithRange(queryOptions, await this.query(app, query, filter.params));
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
        const filter = this.getAppFilter(queryOptions);

        const getQuery = async () => {
            if (pageFilter === undefined) {
                return `
                    SELECT
                      page_url AS key,
                      COUNT(DISTINCT user_hash) AS user_count,
                      SUM(1) AS event_count,
                    FROM
                      ${await this.getTable(app)}
                    WHERE
                      ${filter.where}
                      AND page_url <> ""
                    GROUP BY
                      key
                    ORDER BY
                      user_count DESC
                    ${this.getLimit(queryOptions)}
                `;
            } else {
                return `
                    SELECT
                      page_url AS key,
                      COUNT(DISTINCT user_hash) AS user_count,
                      SUM(1) AS event_count,
                    FROM (
                      SELECT
                        user_hash AS uh,
                        ${pageFilter === 'ENTRY' ? 'MIN' : 'MAX'}(dt) AS dtx,
                      FROM
                        ${await this.getTable(app)}
                      WHERE
                        ${filter.where}
                      GROUP BY
                        user_hash ) AS fq
                    JOIN
                      ${await this.getTable(app)} AS ds
                    ON
                      fq.uh = ds.user_hash
                      AND fq.dtx = ds.dt
                    WHERE
                      ${filter.where}
                      AND page_url <> ""
                    GROUP BY
                      key
                    ORDER BY
                      user_count DESC
                    ${this.getLimit(queryOptions)}
                `;
            }
        };

        return this.getResultWithRange(
            queryOptions,
            await this.query(app, await getQuery(), filter.params),
        );
    }

    public async countries(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const filter = this.getAppFilter(queryOptions);

        const query = `
                    SELECT
                      IF(user_country IS NULL, "${
                          GoogleCloudBigQuery.NULL_AS_STRING
                      }", user_country) AS key,
                      COUNT(DISTINCT user_hash) AS user_count,
                      SUM(1) AS event_count,
                    FROM
                      ${await this.getTable(app)}
                    WHERE
                      ${filter.where}
                    GROUP BY
                      key
                    ORDER BY
                      user_count DESC
                    ${this.getLimit(queryOptions)}
                `;

        return this.getResultWithRange(queryOptions, await this.query(app, query, filter.params));
    }

    public async devices(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const filter = this.getAppFilter(queryOptions);

        const query = `
                    SELECT
                      IF(${this.MOBILE_TEST}, 'Mobile', 'Desktop') AS key,
                      COUNT(DISTINCT user_hash) AS user_count,
                      SUM(1) AS event_count,
                    FROM
                      ${await this.getTable(app)}
                    WHERE
                      ${filter.where}
                    GROUP BY
                      key
                    ORDER BY
                      user_count DESC
                    ${this.getLimit(queryOptions)}
                `;

        return this.getResultWithRange(queryOptions, await this.query(app, query, filter.params));
    }

    public async eventGroups(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const filter = this.getAppFilter(queryOptions);

        const query = `
                    SELECT
                      event_group as key,
                      COUNT(DISTINCT user_hash) AS user_count,
                      SUM(1) AS event_count,
                    FROM
                      ${await this.getTable(app)}
                    WHERE
                      ${filter.where} AND event_group IS NOT NULL
                    GROUP BY
                      key
                    ORDER BY
                      user_count DESC
                    ${this.getLimit(queryOptions)}
                `;

        return this.getResultWithRange(queryOptions, await this.query(app, query, filter.params));
    }

    public async events(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const filter = this.getAppFilter(queryOptions);

        const query = `
                    SELECT
                      event as key,
                      COUNT(DISTINCT user_hash) AS user_count,
                      SUM(1) AS event_count,
                    FROM
                      ${await this.getTable(app)}
                    WHERE
                      ${filter.where}
                    GROUP BY
                      key
                    ORDER BY
                      user_count DESC
                    ${this.getLimit(queryOptions)}
                `;

        return this.getResultWithRange(queryOptions, await this.query(app, query, filter.params));
    }

    public async browsers(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const filter = this.getAppFilter(queryOptions);

        const query = `
                    SELECT
                      browser_name as key,
                      COUNT(DISTINCT user_hash) AS user_count,
                      SUM(1) AS event_count,
                    FROM
                      ${await this.getTable(app)}
                    WHERE
                      ${filter.where}
                    GROUP BY
                      key
                    ORDER BY
                      user_count DESC
                    ${this.getLimit(queryOptions)}
                `;

        return this.getResultWithRange(queryOptions, await this.query(app, query, filter.params));
    }

    public async operatingSystems(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }> {
        const filter = this.getAppFilter(queryOptions);

        const query = `
                    SELECT
                      os_name as key,
                      COUNT(DISTINCT user_hash) AS user_count,
                      SUM(1) AS event_count,
                    FROM
                      ${await this.getTable(app)}
                    WHERE
                      ${filter.where}
                    GROUP BY
                      key
                    ORDER BY
                      user_count DESC
                    ${this.getLimit(queryOptions)}
                `;

        return this.getResultWithRange(queryOptions, await this.query(app, query, filter.params));
    }

    protected getIngestEndpointFilter(queryOptions: IngestQueryOptions): {
        where: string;
        params: { [k: string]: any };
    } {
        const getRevisionFilter = () =>
            typeof queryOptions.filter_options.revision === 'string'
                ? {
                      where: 'revision_id = @revision_id',
                      params: { revision_id: queryOptions.filter_options.revision },
                  }
                : undefined;
        const getEnvironmentFilter = () =>
            typeof queryOptions.filter_options.environment === 'string'
                ? {
                      where: 'environment_id = @environment_id',
                      params: { environment_id: queryOptions.filter_options.environment },
                  }
                : undefined;
        return [getRevisionFilter(), getEnvironmentFilter()].reduce(
            (a, c) => {
                if (c === undefined) {
                    return a;
                } else {
                    return {
                        where: a.where + ' AND ' + c.where,
                        params: { ...a.params, ...c.params },
                    };
                }
            },
            {
                where: this.generateRange(queryOptions),
                params: {},
            },
        );
    }

    public async usage(
        ingestEndpoint: IngestEndpoint,
        queryOptions: IngestQueryOptions,
    ): Promise<{
        result: { key: string; requests: number; bytes: number }[];
        from: Date;
        to: Date;
    }> {
        const filter = this.getIngestEndpointFilter(queryOptions);
        const query = `
                        SELECT
                          FORMAT_DATETIME("${this.getFormatForTimeSlice(queryOptions)}", dt) AS key,
                          SUM(requests) AS requests,
                          SUM(bytes) AS bytes,
                        FROM
                          ${await this.getTable(ingestEndpoint)}
                        WHERE
                          ${filter.where}
                        GROUP BY
                          key
                        ORDER BY
                          key DESC
                        ${this.getLimit(queryOptions)}
                    `.trim();

        return this.getResultWithRange(
            queryOptions,
            await this.query(ingestEndpoint, query, filter.params),
        );
    }

    public async requests(
        ingestEndpoint: IngestEndpoint,
        queryOptions: IngestQueryOptions,
    ): Promise<{ result: { key: string; count: number }[]; from: Date; to: Date }> {
        const filter = this.getIngestEndpointFilter(queryOptions);
        const query = `
                        SELECT
                          FORMAT_DATETIME("${this.getFormatForTimeSlice(queryOptions)}", dt) AS key,
                          SUM(requests) AS count
                        FROM
                          ${await this.getTable(ingestEndpoint)}
                        WHERE
                          ${filter.where}
                        GROUP BY
                          key
                        ORDER BY
                          key DESC
                        ${this.getLimit(queryOptions)}
                    `.trim();

        return this.getResultWithRange(
            queryOptions,
            await this.query(ingestEndpoint, query, filter.params),
        );
    }

    public async bytes(
        ingestEndpoint: IngestEndpoint,
        queryOptions: IngestQueryOptions,
    ): Promise<{ result: { key: string; count: number }[]; from: Date; to: Date }> {
        const filter = this.getIngestEndpointFilter(queryOptions);
        const query = `
                        SELECT
                          FORMAT_DATETIME("${this.getFormatForTimeSlice(queryOptions)}", dt) AS key,
                          SUM(bytes) AS count
                        FROM
                          ${await this.getTable(ingestEndpoint)}
                        WHERE
                          ${filter.where}
                        GROUP BY
                          key
                        ORDER BY
                          key DESC
                        ${this.getLimit(queryOptions)}
                    `.trim();

        return this.getResultWithRange(
            queryOptions,
            await this.query(ingestEndpoint, query, filter.params),
        );
    }
}
