import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';

import SignUpRequest from '../models/SignUpRequest';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class SignUpRequestRepo extends Repo<SignUpRequest> {
    protected readonly EXPIRES_AFTER = 3600 * 24;

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
