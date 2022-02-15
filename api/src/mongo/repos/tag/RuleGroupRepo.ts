import { injectable } from 'inversify';
import RuleGroup from '../../models/tag/RuleGroup';
import UnderRevisionControl from './abstractions/UnderRevisionControl';
import { IndexDescription } from 'mongodb';

@injectable()
export default class RuleGroupRepo extends UnderRevisionControl<RuleGroup> {
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
                _rule_ids: 1,
            },
        },
    ];
}
