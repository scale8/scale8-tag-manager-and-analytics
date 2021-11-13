import { injectable } from 'inversify';
import PlatformAsset from '../../models/tag/PlatformAsset';
import UnderPlatformRevisionControl from './abstractions/UnderPlatformRevisionControl';
import { IndexDescription } from 'mongodb';

@injectable()
export default class PlatformAssetRepo extends UnderPlatformRevisionControl<PlatformAsset> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexDescription[] = [
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
