import { injectable } from 'inversify';
import ActionGroup from '../../models/tag/ActionGroup';
import UnderRevisionControl from './abstractions/UnderRevisionControl';
import { IndexDescription } from 'mongodb';

@injectable()
export default class ActionGroupRepo extends UnderRevisionControl<ActionGroup> {
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
                _action_ids: 1,
            },
        },
    ];
}
