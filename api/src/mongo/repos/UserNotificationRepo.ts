import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';
import UserNotification from '../models/UserNotification';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class UserNotificationRepo extends Repo<UserNotification> {
    protected readonly EXPIRES_AFTER = 86400 * 90;

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
