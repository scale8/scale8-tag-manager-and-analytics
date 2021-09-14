import { inject, injectable } from 'inversify';
import BaseStorage, { StorageOptions } from './abstractions/BaseStorage';
import TYPES from '../../container/IOC.types';
import BaseConfig from '../configuration/abstractions/BaseConfig';
import S3Service from '../../aws/S3Service';
import { S3 } from 'aws-sdk';
import GenericError from '../../errors/GenericError';
import { LogPriority } from '../../enums/LogPriority';

@injectable()
export default class AmazonS3Storage extends BaseStorage {
    @inject(TYPES.BackendConfig) private readonly config!: BaseConfig;
    @inject(TYPES.S3Service) private readonly s3Service!: S3Service;
    private storage: S3 | undefined;

    protected async getStorage() {
        if (this.storage === undefined) {
            this.storage = this.s3Service.getS3Client(
                await this.config.getAwsId(),
                await this.config.getAwsSecret(),
                await this.config.getAwsRegion(),
            );
        }
        return this.storage;
    }

    public async configure(): Promise<void> {
        await this.createBucketIfNotExists(await this.config.getAssetBucket());
        await this.createBucketIfNotExists(await this.config.getConfigsBucket());
    }

    public async bucketExists(bucketName: string): Promise<boolean> {
        return this.s3Service.bucketExists(await this.getStorage(), bucketName);
    }

    public async createBucket(bucketName: string): Promise<void> {
        const created = await this.s3Service.createBucket(
            await this.getStorage(),
            bucketName,
            await this.config.getAwsRegion(),
        );
        if (!created) {
            throw new GenericError(
                `Failed to create S3 bucket ${bucketName}`,
                LogPriority.ERROR,
                true,
            );
        }
    }

    public async getAsString(bucketName: string, key: string): Promise<string> {
        const blob = await this.s3Service.get(await this.getStorage(), bucketName, key);
        return blob.Body === undefined ? '' : blob.Body.toString('utf-8');
    }

    public async setAsString(
        bucketName: string,
        key: string,
        content: string,
        options?: StorageOptions,
    ): Promise<void> {
        await this.s3Service.put(await this.getStorage(), {
            Bucket: bucketName,
            Key: key,
            Body: content,
            ContentType: options?.contentType || this.DEFAULT_MIME_TYPE,
        });
    }
}
