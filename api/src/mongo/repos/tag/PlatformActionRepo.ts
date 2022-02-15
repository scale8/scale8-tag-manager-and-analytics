import { injectable } from 'inversify';
import PlatformAction from '../../models/tag/PlatformAction';
import UnderPlatformRevisionControl from './abstractions/UnderPlatformRevisionControl';
import { IndexDescription } from 'mongodb';

@injectable()
export default class PlatformActionRepo extends UnderPlatformRevisionControl<PlatformAction> {
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
        {
            key: {
                _platform_id: 1,
            },
        },
    ];
}
