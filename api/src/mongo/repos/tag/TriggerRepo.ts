import { injectable } from 'inversify';
import UnderRevisionControl from './abstractions/UnderRevisionControl';
import Trigger from '../../models/tag/Trigger';
import { IndexDescription } from 'mongodb';

@injectable()
export default class TriggerRepo extends UnderRevisionControl<Trigger> {
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
                _event_ids: 1,
            },
        },
        {
            key: {
                _condition_rule_ids: 1,
            },
        },
        {
            key: {
                _exception_rule_ids: 1,
            },
        },
    ];
}
