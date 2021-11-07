import { inject, injectable } from 'inversify';
import BaseStorage, { StorageOptions } from './abstractions/BaseStorage';
import { Storage } from '@google-cloud/storage';
import TYPES from '../../container/IOC.types';
import BaseConfig from '../configuration/abstractions/BaseConfig';
import { getServiceAccountJsonFromConfig } from '../../utils/GoogleCloudUtils';

@injectable()
export default class GoogleCloudStorage extends BaseStorage {
    @inject(TYPES.BackendConfig) private readonly config!: BaseConfig;
    private storage: Storage | undefined;

    protected async getStorage() {
        const serviceAccountJson = await getServiceAccountJsonFromConfig();
        if (this.storage === undefined) {
            this.storage = new Storage({
                projectId: serviceAccountJson.project_id,
                credentials: {
                    client_email: serviceAccountJson.client_email,
                    private_key: serviceAccountJson.private_key,
                },
            });
        }
        return this.storage;
    }

    public async configure(): Promise<void> {
        await this.createBucketIfNotExists(await this.config.getAssetBucket());
        await this.createBucketIfNotExists(await this.config.getConfigsBucket());
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

    public async getAsString(bucketName: string, key: string): Promise<any> {
        const data = await (await this.getStorage()).bucket(bucketName).file(key).download();
        return data[0];
    }

    public async setAsString(
        bucketName: string,
        key: string,
        content: string,
        options?: StorageOptions,
    ): Promise<void> {
        await (
            await this.getStorage()
        )
            .bucket(bucketName)
            .file(key)
            .save(content, {
                contentType: options?.contentType || this.DEFAULT_MIME_TYPE,
            });
    }
}
