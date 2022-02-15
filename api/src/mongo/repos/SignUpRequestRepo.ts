import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';

import SignUpRequest from '../models/SignUpRequest';
import { IndexDescription } from 'mongodb';

@injectable()
export default class SignUpRequestRepo extends Repo<SignUpRequest> {
    protected readonly EXPIRES_AFTER = 3600 * 24;

    protected readonly indexes: IndexDescription[] = [
        {
            key: {
                _created_at: 1,
            },
            expireAfterSeconds: this.EXPIRES_AFTER,
        },
        {
            key: {
                _token: 1,
            },
        },
    ];
}
