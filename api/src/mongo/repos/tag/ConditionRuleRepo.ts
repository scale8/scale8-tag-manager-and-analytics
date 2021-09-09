import { injectable } from 'inversify';
import ConditionRule from '../../models/tag/ConditionRule';
import UnderRevisionControl from './abstractions/UnderRevisionControl';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class ConditionRuleRepo extends UnderRevisionControl<ConditionRule> {
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
