import { injectable } from 'inversify';
import PlatformAsset from '../../models/tag/PlatformAsset';
import UnderPlatformRevisionControl from './abstractions/UnderPlatformRevisionControl';
import { IndexDescription } from 'mongodb';

@injectable()
export default class PlatformAssetRepo extends UnderPlatformRevisionControl<PlatformAsset> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexDescription[] = [
        {
            key: {
                ___persisting_id: 1,
                _revision_id: 1,
            },
            unique: true,
        },
        {
            key: {
                _platform_id: 1,
            },
        },
        {
            key: {
                _is_primary: 1,
            },
        },
    ];
}
