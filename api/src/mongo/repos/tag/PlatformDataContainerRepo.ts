import { injectable } from 'inversify';
import PlatformDataContainer from '../../models/tag/PlatformDataContainer';
import UnderPlatformRevisionControl from './abstractions/UnderPlatformRevisionControl';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class PlatformDataContainerRepo extends UnderPlatformRevisionControl<PlatformDataContainer> {
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
