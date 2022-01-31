import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';
import UserNotification from '../models/UserNotification';
import { IndexDescription } from 'mongodb';

@injectable()
export default class UserNotificationRepo extends Repo<UserNotification> {
    protected readonly EXPIRES_AFTER = 86400 * 90;

    protected readonly indexes: IndexDescription[] = [
        {
            key: {
                _created_at: 1,
            },
            expireAfterSeconds: this.EXPIRES_AFTER,
        },
        {
            key: {
                _user_id: 1,
            },
        },
        {
            key: {
                _is_viewed: 1,
            },
        },
    ];
}
