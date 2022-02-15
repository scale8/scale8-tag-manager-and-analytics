import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';
import { IndexDescription } from 'mongodb';
import Usage from '../models/Usage';
import DataManagerAccount from '../models/data/DataManagerAccount';
import TagManagerAccount from '../models/tag/TagManagerAccount';
import { endOfDay, startOfDay } from 'date-fns';

@injectable()
export default class UsageRepo extends Repo<Usage> {
    protected readonly indexes: IndexDescription[] = [
        {
            key: {
                _usage_entity_id: 1,
                _day: 1,
            },
            unique: true,
        },
    ];

    /**
     * Gets the usage data for a specified account
     *
     * @param entity
     * @param from
     * @param to
     */
    public async getUsageDataForAccount(
        entity: DataManagerAccount | TagManagerAccount,
        from: Date,
        to: Date,
    ): Promise<Usage[]> {
        return this.find({
            _usage_entity_id: entity.id,
            _day: {
                $gte: startOfDay(from),
                $lt: endOfDay(to),
            },
        });
    }
}
