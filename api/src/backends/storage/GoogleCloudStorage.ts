import { inject, injectable } from 'inversify';
import BaseStorage, { StorageOptions } from './abstractions/BaseStorage';
import { Storage } from '@google-cloud/storage';
import TYPES from '../../container/IOC.types';
import BaseConfig from '../configuration/abstractions/BaseConfig';

@injectable()
export default class GoogleCloudStorage extends BaseStorage {
    @inject(TYPES.BackendConfig) private readonly config!: BaseConfig;
    private storage: Storage | undefined;

    protected async getStorage() {
        if (this.storage === undefined) {
            this.storage = new Storage({
                keyFilename: await this.config.getGCKeyFile(),
                projectId: await this.config.getGCProjectId(),
            });
        }
        return this.storage;
    }

    public async configure(): Promise<void> {
        await this.createBucketIfNotExists(await this.config.getGCAssetBucket());
        await this.createBucketIfNotExists(await this.config.getGCConfigsBucket());
    }

    public async bucketExists(bucketName: string): Promise<boolean> {
        const [exists] = await (await this.getStorage()).bucket(bucketName).exists();
        return exists;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public async createBucket(bucketName: string): Promise<void> {
        await (
            await this.getStorage()
        ).createBucket(bucketName, {
            location: 'EU',
            multiRegional: true,
        });
    }

    public async get(bucketName: string, key: string): Promise<any> {
        const data = await (await this.getStorage()).bucket(bucketName).file(key).download();
        return data[0];
    }

    public async put(
        bucketName: string,
        key: string,
        blob: any,
        options?: StorageOptions,
    ): Promise<void> {
        await (
            await this.getStorage()
        )
            .bucket(bucketName)
            .file(key)
            .save(blob, {
                contentType: options?.contentType || this.DEFAULT_MIME_TYPE,
            });
    }
}
