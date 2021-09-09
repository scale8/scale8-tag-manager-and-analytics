import { injectable } from 'inversify';
import UnderRevisionControl from './abstractions/UnderRevisionControl';
import Trigger from '../../models/tag/Trigger';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class TriggerRepo extends UnderRevisionControl<Trigger> {
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
