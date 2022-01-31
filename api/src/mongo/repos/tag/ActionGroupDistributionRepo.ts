import { injectable } from 'inversify';
import ActionGroupDistribution from '../../models/tag/ActionGroupDistribution';
import UnderRevisionControl from './abstractions/UnderRevisionControl';
import { IndexDescription } from 'mongodb';
import userMessages from '../../../errors/UserMessages';
import Rule from '../../models/tag/Rule';

@injectable()
export default class ActionGroupDistributionRepo extends UnderRevisionControl<ActionGroupDistribution> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexDescription[] = [
        {
            key: {
                ___persisting_id: 1,
                _revision_id: 1,
            },
            unique: true,
        },
    ];

    public async getAllFromRule(rule: Rule): Promise<ActionGroupDistribution[]> {
        return await Promise.all(
            rule.actionGroupDistributionIds.map((id) => {
                if (typeof id === 'string') {
                    return this.findOneThrows(
                        {
                            _revision_id: rule.revisionId,
                            ___persisting_id: id,
                        },
                        userMessages.actionGroupDistributionFailed,
                    );
                } else {
                    return this.findByIdThrows(id, userMessages.actionGroupDistributionFailed);
                }
            }),
        );
    }
}
