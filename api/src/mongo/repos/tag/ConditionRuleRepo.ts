import { injectable } from 'inversify';
import ConditionRule from '../../models/tag/ConditionRule';
import UnderRevisionControl from './abstractions/UnderRevisionControl';
import { IndexDescription } from 'mongodb';

@injectable()
export default class ConditionRuleRepo extends UnderRevisionControl<ConditionRule> {
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
                _platform_data_container_id: 1,
            },
        },
    ];
}
