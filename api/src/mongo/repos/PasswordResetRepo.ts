import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';
import PasswordReset from '../models/PasswordReset';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class PasswordResetRepo extends Repo<PasswordReset> {
    protected readonly EXPIRES_AFTER = 3600 * 6;

    protected readonly indexes: IndexSpecification[] = [
        {
            background: false,
            key: {
                _created_at: 1,
            },
            expireAfterSeconds: this.EXPIRES_AFTER,
        },
    ];
}
