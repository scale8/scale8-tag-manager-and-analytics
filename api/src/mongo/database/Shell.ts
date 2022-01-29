import { inject, injectable } from 'inversify';
import {
    ClientSession,
    Collection,
    Db,
    MongoClient,
    ReadConcern,
    ReadPreference,
    TransactionOptions,
    WriteConcern,
} from 'mongodb';
import TYPES from '../../container/IOC.types';
import GenericError from '../../errors/GenericError';
import DatabaseError from '../../errors/DatabaseError';
import userMessages from '../../errors/UserMessages';
import { LogPriority } from '../../enums/LogPriority';
import BaseLogger from '../../backends/logging/abstractions/BaseLogger';
import BaseConfig from '../../backends/configuration/abstractions/BaseConfig';

@injectable()
export default class Shell {
    @inject(TYPES.BackendLogger) private readonly logger!: BaseLogger;
    @inject(TYPES.BackendConfig) private readonly config!: BaseConfig;

    protected connection: MongoClient | null = null;

    public async connect(): Promise<MongoClient> {
        if (this.connection === null) {
            const client = new MongoClient(await this.config.getDatabaseUrl());
            this.connection = await client.connect();
        }
        return this.connection;
    }

    public async getClientSession(): Promise<ClientSession> {
        const connection = await this.connect();
        return connection.startSession({
            defaultTransactionOptions: {
                readPreference: ReadPreference.fromString('primary'),
                readConcern: ReadConcern.fromOptions({ level: 'local' }),
                writeConcern: WriteConcern.fromOptions({ w: 'majority' }),
            },
        });
    }

    public async transactionWrap<U>(
        transaction: (session: ClientSession | undefined) => Promise<U>,
        options?: TransactionOptions,
    ): Promise<U> {
        if (await this.config.isTransactionSupport()) {
            const clientSession: ClientSession = await this.getClientSession();
            let result: U;
            return new Promise((resolve, reject) => {
                clientSession
                    .withTransaction(
                        async () => (result = await transaction(clientSession)),
                        options,
                    )
                    .then(() => resolve(result))
                    .catch((e) => {
                        //re-wrap these errors to make a bit more sense of them...
                        if (e instanceof GenericError) {
                            reject(
                                new DatabaseError(
                                    userMessages.transactionDataFailure,
                                    e.getUserMessage(),
                                    e,
                                ),
                            );
                        } else if (e instanceof Error) {
                            reject(new DatabaseError(userMessages.transactionDataFailure, true, e));
                        } else if (typeof e === 'string') {
                            reject(
                                new DatabaseError(
                                    userMessages.transactionDataFailure,
                                    true,
                                    new GenericError(e, LogPriority.ERROR),
                                ),
                            );
                        } else {
                            reject(new DatabaseError(userMessages.transactionDataFailure, true));
                        }
                    })
                    .finally(() => clientSession.endSession());
            });
        } else {
            return await transaction(undefined);
        }
    }

    public async disconnect(): Promise<void> {
        if (this.connection !== null) {
            return this.connection.close();
        }
    }

    public async getDatabase(databaseName?: string): Promise<Db> {
        const connection = await this.connect();
        return connection.db(
            databaseName !== undefined ? databaseName : await this.config.getDefaultDatabase(),
        );
    }

    public async getCollection(collectionName: string, databaseName?: string): Promise<Collection> {
        const db = await this.getDatabase(
            databaseName !== undefined ? databaseName : await this.config.getDefaultDatabase(),
        );
        return db.collection(collectionName);
    }
}
