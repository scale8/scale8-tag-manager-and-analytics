import { injectable } from 'inversify';
import PlatformAction from '../../models/tag/PlatformAction';
import UnderPlatformRevisionControl from './abstractions/UnderPlatformRevisionControl';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class PlatformActionRepo extends UnderPlatformRevisionControl<PlatformAction> {
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
