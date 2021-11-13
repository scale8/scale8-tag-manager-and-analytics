import { injectable } from 'inversify';
import DataMap from '../../models/tag/DataMap';
import UnderRevisionControl from './abstractions/UnderRevisionControl';
import { IndexDescription } from 'mongodb';

@injectable()
export default class DataMapRepo extends UnderRevisionControl<DataMap> {
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
