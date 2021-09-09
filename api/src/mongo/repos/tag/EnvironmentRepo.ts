import Repo from '../../abstractions/Repo';
import { injectable } from 'inversify';
import Environment from '../../models/tag/Environment';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class EnvironmentRepo extends Repo<Environment> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexSpecification[] = [
        {
            background: false,
            key: {
                _app_id: 1,
            },
        },
    ];
}
