import { injectable } from 'inversify';
import App from '../../../mongo/models/tag/App';
import IngestEndpoint from '../../../mongo/models/data/IngestEndpoint';
import { ObjectId } from 'mongodb';
import GenericError from '../../../errors/GenericError';
import { LogPriority } from '../../../enums/LogPriority';
import { WebTrafficType } from '../../../enums/WebTrafficType';

export interface BaseQueryOptions {
    time_slice: string;
    filter_options: {
        from: number;
        to: number;
        revision?: string;
        environment?: string;
    };
    limit: number;
}

export interface AppQueryOptions extends BaseQueryOptions {
    filter_options: {
        from: number;
        to: number;
        revision?: string;
        environment?: string;
        utm_source?: string;
        utm_medium?: string;
        utm_campaign?: string;
        utm_term?: string;
        utm_content?: string;
        country?: string;
        region?: string;
        city?: string;
        referrer?: string;
        referrer_tld?: string;
        page?: string;
        mobile?: boolean;
        browser?: string;
        browser_version?: string;
        screen_size?: string;
        os?: string;
        traffic_type?: WebTrafficType;
        event?: string;
        event_group?: string;
        custom_release_id?: string;
        error_id?: string;
        error_file?: string;
        error_message?: string;
    };
}

export interface IngestQueryOptions extends BaseQueryOptions {
    filter_options: {
        from: number;
        to: number;
        revision?: string;
        environment?: string;
    };
}

@injectable()
export default abstract class BaseDatabase {
    protected static readonly NULL_AS_STRING = '--';

    protected getRangeFromAsDate(options: BaseQueryOptions): Date {
        return new Date(options.filter_options.from);
    }

    protected getRangeToAsDate(options: BaseQueryOptions): Date {
        return new Date(options.filter_options.to);
    }

    protected getEntityUsageIngestEndpointEnvironmentId(entity: App | IngestEndpoint): ObjectId {
        if (entity.usageIngestEndpointEnvironmentId === undefined) {
            throw new GenericError(
                `Unable to find usage endpoint for ${
                    entity.constructor.name
                }: ${entity.id.toString()}`,
                LogPriority.ERROR,
            );
        } else {
            return entity.usageIngestEndpointEnvironmentId;
        }
    }

    protected getResultWithRange(
        queryOptions: AppQueryOptions,
        result: any,
    ): {
        result: any;
        from: Date;
        to: Date;
    } {
        return {
            from: this.getRangeFromAsDate(queryOptions),
            to: this.getRangeToAsDate(queryOptions),
            result,
        };
    }

    public abstract averageSessionDuration(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{ result: number; from: Date; to: Date }>;

    public abstract bounceRatio(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{ result: number; from: Date; to: Date }>;

    public abstract eventRequests(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract referrers(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract referrerTlds(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract utms(
        app: App,
        queryOptions: AppQueryOptions,
        utmFilter: 'MEDIUM' | 'SOURCE' | 'CAMPAIGN',
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract pages(
        app: App,
        queryOptions: AppQueryOptions,
        pageFilter?: 'ENTRY' | 'EXIT',
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract countries(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract regions(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract cities(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract devices(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract eventGroups(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract events(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract screenSizes(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract browsers(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract browserVersions(
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
    }>;

    public abstract operatingSystems(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract errors(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: {
            error_id: string;
            error_file: string;
            error_message: string;
            error_column: number;
            error_row: number;
            error_trace: string;
            user_count: number;
            event_count: number;
        }[];
        from: Date;
        to: Date;
    }>;

    public abstract usage(
        ingestEndpoint: IngestEndpoint,
        queryOptions: IngestQueryOptions,
    ): Promise<{
        result: { key: string; requests: number; bytes: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract requests(
        ingestEndpoint: IngestEndpoint,
        queryOptions: IngestQueryOptions,
    ): Promise<{ result: { key: string; count: number }[]; from: Date; to: Date }>;

    public abstract bytes(
        ingestEndpoint: IngestEndpoint,
        queryOptions: IngestQueryOptions,
    ): Promise<{ result: { key: string; count: number }[]; from: Date; to: Date }>;
}
