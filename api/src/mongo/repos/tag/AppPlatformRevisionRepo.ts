import { injectable } from 'inversify';
import AppPlatformRevision from '../../models/tag/AppPlatformRevision';
import UnderRevisionControl from './abstractions/UnderRevisionControl';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class AppPlatformRevisionRepo extends UnderRevisionControl<AppPlatformRevision> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexSpecification[] = [
        {
            background: false,
            key: {
                ___persisting_id: 1,
                _revision_id: 1,
            },
            unique: true,
        },
    ];
}
