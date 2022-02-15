import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';
import { IndexDescription } from 'mongodb';
import Dependency from '../models/Dependency';

@injectable()
export default class DependencyRepo extends Repo<Dependency> {
    protected readonly indexes: IndexDescription[] = [
        {
            key: {
                _model_id: 1,
            },
        },
        {
            key: {
                _model_name: 1,
            },
        },
        {
            key: {
                _depends_on_model_id: 1,
            },
        },
        {
            key: {
                _depends_on_model_name: 1,
            },
        },
    ];
}
