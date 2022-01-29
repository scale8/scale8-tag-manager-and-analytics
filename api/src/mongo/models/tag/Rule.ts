import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectId } from 'mongodb';
import Revision from './Revision';
import TriggerRepo from '../../repos/tag/TriggerRepo';
import Trigger from './Trigger';
import ActionGroupDistributionRepo from '../../repos/tag/ActionGroupDistributionRepo';
import ActionGroupDistribution from './ActionGroupDistribution';
import GQLError from '../../../errors/GQLError';
import ScalarContainer from '../../custom/ScalarContainer';
import userMessages from '../../../errors/UserMessages';

export default class Rule extends Model {
    public getOrgEntityId(): ObjectId {
        return this.orgId;
    }

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'org_id',
    })
    private readonly _org_id!: ObjectId;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'name',
        exposeToConfig: true,
    })
    private _name: string;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'tag_manager_account_id',
    })
    private readonly _tag_manager_account_id!: ObjectId;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'app_id',
    })
    private readonly _app_id!: ObjectId;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'revision_id',
    })
    private readonly _revision_id!: ObjectId;

    @Field<ObjectId>({
        repository: TriggerRepo, //we want custom triggers to clone
        exposeToGQLAs: 'custom_trigger_id',
        exposeToConfig: true,
    })
    private readonly _custom_trigger_id?: ObjectId;

    //we don't want global triggers to clone except on a revision...
    @Field<ObjectId>({
        exposeToGQLAs: 'global_trigger_id',
        exposeToConfig: true,
    })
    private readonly _global_trigger_id?: string; //we have to use the persisting id here

    @Field<ObjectId[]>({
        repository: ActionGroupDistributionRepo, //we want custom action group distributions to clone
        exposeToGQLAs: 'custom_action_group_distribution_ids',
        exposeToConfig: true,
    })
    private _custom_action_group_distribution_ids: ObjectId[] = [];

    //we don't want global action group distributions to clone except on a revision...
    @Field<ScalarContainer<string>>({
        exposeToGQLAs: 'global_action_group_distribution_ids',
        exposeToConfig: true,
    })
    private _global_action_group_distribution_ids: ScalarContainer<string> = new ScalarContainer<string>();

    //we don't want global action group distributions to clone except on a revision...
    @Field<ScalarContainer<string>>({
        exposeToConfig: true,
    })
    private _action_group_order: ScalarContainer<string> = new ScalarContainer<string>();

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'is_active',
        exposeToConfig: true,
    })
    private _is_active: boolean;

    @Field<number>({
        required: true,
        exposeToGQLAs: 'min_repeat_interval',
        exposeToConfig: true,
    })
    private _min_repeat_interval: number;

    constructor(
        name: string,
        revision: Revision,
        trigger: Trigger,
        actionGroupDistributions: ActionGroupDistribution[] = [],
        minRepeatInterval = -1,
    ) {
        super();
        this._name = name;
        if (revision !== undefined) {
            this._org_id = revision.orgId;
            this._tag_manager_account_id = revision.tagManagerAccountId;
            this._app_id = revision.appId;
            this._revision_id = revision.id;
        }
        if (trigger !== undefined) {
            if (trigger.parentType === 'REVISION') {
                //this is a global trigger attachment...
                this._global_trigger_id = trigger._persisting_id;
            } else {
                //this is a custom rule based trigger...
                this._custom_trigger_id = trigger.id;
            }
        }
        this.setActionGroupDistributions(actionGroupDistributions);
        this._is_active = true;
        this._min_repeat_interval = minRepeatInterval;
    }

    get orgId(): ObjectId {
        return this._org_id;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get minRepeatInterval(): number {
        return this._min_repeat_interval;
    }

    set minRepeatInterval(value: number) {
        this._min_repeat_interval = value;
    }

    get tagManagerAccountId(): ObjectId {
        return this._tag_manager_account_id;
    }

    get appId(): ObjectId {
        return this._app_id;
    }

    get revisionId(): ObjectId {
        return this._revision_id;
    }

    get triggerId(): ObjectId | string {
        if (this._global_trigger_id !== undefined) {
            return this._global_trigger_id;
        } else if (this._custom_trigger_id !== undefined) {
            return this._custom_trigger_id;
        } else {
            throw new GQLError(userMessages.ruleNoTrigger, true);
        }
    }

    get actionGroupDistributionIds(): (ObjectId | string)[] {
        //return preserving insertion order...
        const global = this._global_action_group_distribution_ids.arr;
        const custom = this._custom_action_group_distribution_ids;
        let nextGlobalPointer = 0;
        let nextCustomPointer = 0;
        const getNextGlobalId = () => {
            const id = global[nextGlobalPointer];
            nextGlobalPointer++;
            return id;
        };
        const getNextCustomId = () => {
            const id = custom[nextCustomPointer];
            nextCustomPointer++;
            return id;
        };
        return this._action_group_order.arr.map((_) =>
            _ === 'G' ? getNextGlobalId() : getNextCustomId(),
        );
    }

    public setActionGroupDistributions(actionGroupDistributions: ActionGroupDistribution[]) {
        this._action_group_order = new ScalarContainer(
            ...actionGroupDistributions.map((_) => (_.parentType === 'REVISION' ? 'G' : 'C')),
        );
        this._global_action_group_distribution_ids = new ScalarContainer<string>(
            ...actionGroupDistributions
                .filter((_) => _.parentType === 'REVISION')
                .map((_) => _._persisting_id),
        );
        this._custom_action_group_distribution_ids = actionGroupDistributions
            .filter((_) => _.parentType === 'RULE')
            .map((_) => _.id);
    }
}
