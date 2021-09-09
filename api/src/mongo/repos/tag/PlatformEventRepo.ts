import { injectable } from 'inversify';
import PlatformEvent from '../../models/tag/PlatformEvent';
import UnderPlatformRevisionControl from './abstractions/UnderPlatformRevisionControl';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class PlatformEventRepo extends UnderPlatformRevisionControl<PlatformEvent> {
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
