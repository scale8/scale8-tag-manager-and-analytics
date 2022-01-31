import Repo from '../../abstractions/Repo';
import { injectable } from 'inversify';
import PlatformRevision from '../../models/tag/PlatformRevision';
import { IndexDescription } from 'mongodb';

@injectable()
export default class PlatformRevisionRepo extends Repo<PlatformRevision> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexDescription[] = [
        {
            key: {
                _platform_id: 1,
            },
        },
        {
            key: {
                _name: 1,
            },
        },
        {
            key: {
                _is_published: 1,
            },
        },
        {
            key: {
                _is_final: 1,
            },
        },
    ];
}
