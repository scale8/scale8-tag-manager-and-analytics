import { injectable } from 'inversify';
import PlatformDataMap from '../../models/tag/PlatformDataMap';
import UnderPlatformRevisionControl from './abstractions/UnderPlatformRevisionControl';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class PlatformDataMapRepo extends UnderPlatformRevisionControl<PlatformDataMap> {
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
