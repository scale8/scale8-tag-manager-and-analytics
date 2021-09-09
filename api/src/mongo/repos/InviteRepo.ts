import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';
import Invite from '../models/Invite';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class InviteRepo extends Repo<Invite> {
    protected readonly EXPIRES_AFTER = 86400 * 3;

    protected readonly indexes: IndexSpecification[] = [
        {
            background: false,
            key: {
                _email: 1,
                _org_id: 1,
            },
            unique: true,
        },
        {
            background: false,
            key: {
                _created_at: 1,
            },
            expireAfterSeconds: this.EXPIRES_AFTER,
        },
    ];
}
