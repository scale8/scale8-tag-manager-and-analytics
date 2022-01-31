import { injectable } from 'inversify';
import Tag from '../../models/tag/Tag';
import UnderRevisionControl from './abstractions/UnderRevisionControl';
import { IndexDescription } from 'mongodb';

@injectable()
export default class TagRepo extends UnderRevisionControl<Tag> {
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
                _rule_group_ids: 1,
            },
        },
    ];
}
