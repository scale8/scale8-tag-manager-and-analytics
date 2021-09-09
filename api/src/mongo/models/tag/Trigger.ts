import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import Event from './Event';
import ConditionRule from './ConditionRule';
import Revision from './Revision';
import ConditionRuleRepo from '../../repos/tag/ConditionRuleRepo';
import EventRepo from '../../repos/tag/EventRepo';
import { RevisionEntityParentType } from '../../../enums/RevisionEntityParentType';

export default class Trigger extends Model {
    public getOrgEntityId(): ObjectID {
        return this.orgId;
    }

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'org_id',
    })
    private readonly _org_id!: ObjectID;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'name',
        exposeToConfig: true,
    })
    private _name: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'parent_type',
        exposeToConfig: true,
    })
    private readonly _parent_type: RevisionEntityParentType;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'tag_manager_account_id',
    })
    private readonly _tag_manager_account_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'app_id',
    })
    private readonly _app_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'revision_id',
    })
    private readonly _revision_id!: ObjectID;

    @Field<ObjectID[]>({
        repository: EventRepo,
        exposeToGQLAs: 'event_ids',
        exposeToConfig: true,
    })
    private _event_ids: ObjectID[] = [];

    @Field<ObjectID[]>({
        repository: ConditionRuleRepo,
        exposeToGQLAs: 'condition_rule_ids',
        exposeToConfig: true,
    })
    private _condition_rule_ids: ObjectID[] = [];

    @Field<ObjectID[]>({
        repository: ConditionRuleRepo,
        exposeToGQLAs: 'exception_rule_ids',
        exposeToConfig: true,
    })
    private _exception_rule_ids: ObjectID[] = [];

    constructor(
        name: string,
        parentType: RevisionEntityParentType,
        revision: Revision,
        events: Event[] = [],
        conditionRules: ConditionRule[] = [],
        exceptionRules: ConditionRule[] = [],
    ) {
        super();
        this._name = name;
        this._parent_type = parentType;
        if (revision !== undefined) {
            this._org_id = revision.orgId;
            this._tag_manager_account_id = revision.tagManagerAccountId;
            this._app_id = revision.appId;
            this._revision_id = revision.id;
        }
        this._event_ids = events.map((_) => _.id);
        this._condition_rule_ids = conditionRules.map((_) => _.id);
        this._exception_rule_ids = exceptionRules.map((_) => _.id);
    }

    get orgId(): ObjectID {
        return this._org_id;
    }

    get parentType(): RevisionEntityParentType {
        return this._parent_type;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get tagManagerAccountId(): ObjectID {
        return this._tag_manager_account_id;
    }

    get appId(): ObjectID {
        return this._app_id;
    }

    get revisionId(): ObjectID {
        return this._revision_id;
    }

    get eventIds(): ObjectID[] {
        return this._event_ids;
    }

    set eventIds(value: ObjectID[]) {
        this._event_ids = value;
    }

    get conditionRuleIds(): ObjectID[] {
        return this._condition_rule_ids;
    }

    set conditionRuleIds(value: ObjectID[]) {
        this._condition_rule_ids = value;
    }

    get exceptionRuleIds(): ObjectID[] {
        return this._exception_rule_ids;
    }

    set exceptionRuleIds(value: ObjectID[]) {
        this._exception_rule_ids = value;
    }
}
