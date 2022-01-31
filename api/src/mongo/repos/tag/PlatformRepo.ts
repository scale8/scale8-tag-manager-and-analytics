import Repo from '../../abstractions/Repo';
import { injectable } from 'inversify';
import Platform from '../../models/tag/Platform';
import { IndexDescription } from 'mongodb';

@injectable()
export default class PlatformRepo extends Repo<Platform> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexDescription[] = [
        {
            key: {
                _name: 1,
            },
        },
        {
            key: {
                _is_core: 1,
            },
        },
        {
            key: {
                _is_public: 1,
            },
        },
        {
            key: {
                _tag_manager_account_id: 1,
            },
        },
    ];
}
