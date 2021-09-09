import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';
import Org from '../models/Org';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class OrgRepo extends Repo<Org> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexSpecification[] = [
        {
            background: false,
            key: {
                _name: 1,
            },
            unique: true,
        },
    ];
}
