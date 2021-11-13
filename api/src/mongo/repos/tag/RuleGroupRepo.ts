import { injectable } from 'inversify';
import RuleGroup from '../../models/tag/RuleGroup';
import UnderRevisionControl from './abstractions/UnderRevisionControl';
import { IndexDescription } from 'mongodb';

@injectable()
export default class RuleGroupRepo extends UnderRevisionControl<RuleGroup> {
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
