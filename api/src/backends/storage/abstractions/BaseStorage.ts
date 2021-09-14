import { injectable } from 'inversify';

export interface StorageOptions {
    contentType?: string;
}

@injectable()
export default abstract class BaseStorage {
    protected readonly DEFAULT_MIME_TYPE = 'application/octet-stream';

    public abstract configure(): Promise<void>;

    public abstract bucketExists(bucketName: string): Promise<boolean>;

    public abstract createBucket(bucketName: string): Promise<void>;

    public async createBucketIfNotExists(bucketName: string): Promise<void> {
        if (!(await this.bucketExists(bucketName))) {
            return this.createBucket(bucketName);
        }
    }

    public abstract setAsString(
        bucketName: string,
        key: string,
        config: string,
        options?: StorageOptions,
    ): Promise<void>;

    public abstract getAsString(bucketName: string, key: string): Promise<string>;
}
