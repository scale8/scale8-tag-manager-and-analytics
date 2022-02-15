import { injectable } from 'inversify';
import Rule from '../../models/tag/Rule';
import UnderRevisionControl from './abstractions/UnderRevisionControl';
import { IndexDescription } from 'mongodb';

@injectable()
export default class RuleRepo extends UnderRevisionControl<Rule> {
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
                _global_trigger_id: 1,
            },
        },
        {
            key: {
                _revision_id: 1,
            },
        },
        {
            key: {
                _custom_action_group_distribution_ids: 1,
            },
        },
        {
            key: {
                _global_action_group_distribution_ids: 1,
            },
        },
    ];
}
