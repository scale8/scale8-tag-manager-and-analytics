import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';
import Audit from '../models/Audit';

import DataError from '../../errors/DataError';
import { IndexDescription } from 'mongodb';
import userMessages from '../../errors/UserMessages';

@injectable()
export default class AuditRepo extends Repo<Audit> {
    protected readonly EXPIRES_AFTER = 86400 * 365;

    protected readonly indexes: IndexDescription[] = [
        {
            background: false,
            key: {
                _created_at: 1,
            },
            expireAfterSeconds: this.EXPIRES_AFTER,
        },
    ];

    public async delete(): Promise<void> {
        throw new DataError(userMessages.auditRemove, true);
    }

    public async save(): Promise<Audit> {
        throw new DataError(userMessages.auditSave, true);
    }
}
