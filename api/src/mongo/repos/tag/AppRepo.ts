import Repo from '../../abstractions/Repo';
import { injectable } from 'inversify';
import App from '../../models/tag/App';
import { IndexDescription } from 'mongodb';

@injectable()
export default class AppRepo extends Repo<App> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexDescription[] = [
        {
            background: false,
            key: {
                _tag_manager_account_id: 1,
            },
        },
    ];
}
