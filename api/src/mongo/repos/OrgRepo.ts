import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';
import Org from '../models/Org';
import { IndexDescription } from 'mongodb';

@injectable()
export default class OrgRepo extends Repo<Org> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexDescription[] = [
        {
            key: {
                _name: 1,
            },
            unique: true,
        },
        {
            key: {
                _stripe_subscription_id: 1,
            },
        },
        {
            key: {
                _stripe_customer_id: 1,
            },
        },
    ];
}
