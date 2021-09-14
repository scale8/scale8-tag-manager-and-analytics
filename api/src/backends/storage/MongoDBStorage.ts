import { inject, injectable } from 'inversify';
import BaseStorage, { StorageOptions } from './abstractions/BaseStorage';
import TYPES from '../../container/IOC.types';
import Shell from '../../mongo/database/Shell';
import GenericError from '../../errors/GenericError';
import { Collection } from 'mongodb';
import { LogPriority } from '../../enums/LogPriority';
import BaseLogger from '../logging/abstractions/BaseLogger';

@injectable()
export default class MongoDBStorage extends BaseStorage {
    @inject(TYPES.Shell) protected readonly shell!: Shell;
    @inject(TYPES.BackendLogger) protected readonly logger!: BaseLogger;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public async configure(): Promise<void> {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async bucketExists(bucketName: string): Promise<boolean> {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
    public async createBucket(bucketName: string): Promise<void> {}

    private async getCollection(bucketName: string): Promise<Collection> {
        return this.shell.getCollection(`${bucketName}_bucket`);
    }

    public async getAsString(bucketName: string, key: string): Promise<any> {
        const collection = await this.getCollection(bucketName);
        const doc = await collection.findOne({ key: key });
        if (doc) {
            return doc.blob;
        } else {
            throw new GenericError(
                `Failed to find storage item ${key} in ${bucketName}`,
                LogPriority.ERROR,
            );
        }
    }

    public async setAsString(
        bucketName: string,
        key: string,
        config: string,
        options?: StorageOptions,
    ): Promise<void> {
        this.logger.info(`Adding ${key} to ${bucketName}`).then();
        const collection = await this.getCollection(bucketName);
        try {
            await collection.replaceOne(
                { key: key },
                {
                    key: key,
                    blob: config,
                    meta: { contentType: options?.contentType || this.DEFAULT_MIME_TYPE },
                },
                { upsert: true },
            );
        } catch (e) {
            throw new GenericError(
                `Failed to insert/update ${key} and respective value in ${bucketName}`,
                LogPriority.ERROR,
                undefined,
                e,
            );
        }
    }
}
