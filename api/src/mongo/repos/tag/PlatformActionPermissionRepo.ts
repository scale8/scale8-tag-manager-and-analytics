import { injectable } from 'inversify';
import UnderPlatformRevisionControl from './abstractions/UnderPlatformRevisionControl';
import { IndexDescription } from 'mongodb';
import PlatformActionPermission from '../../models/tag/PlatformActionPermission';

@injectable()
export default class PlatformActionPermissionRepo extends UnderPlatformRevisionControl<PlatformActionPermission> {
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
                _revision_id: 1,
            },
        },
    ];
}
