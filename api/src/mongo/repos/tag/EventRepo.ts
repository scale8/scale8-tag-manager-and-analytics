import { injectable } from 'inversify';
import Event from '../../models/tag/Event';
import UnderRevisionControl from './abstractions/UnderRevisionControl';
import { IndexDescription } from 'mongodb';

@injectable()
export default class EventRepo extends UnderRevisionControl<Event> {
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
