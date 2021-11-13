import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectId } from 'mongodb';
import Event from './Event';
import ConditionRule from './ConditionRule';
import Revision from './Revision';
import ConditionRuleRepo from '../../repos/tag/ConditionRuleRepo';
import EventRepo from '../../repos/tag/EventRepo';
import { RevisionEntityParentType } from '../../../enums/RevisionEntityParentType';

export default class Trigger extends Model {
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

    @Field<string>({
        required: true,
        exposeToGQLAs: 'parent_type',
        exposeToConfig: true,
    })
    private readonly _parent_type: RevisionEntityParentType;

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

    @Field<ObjectId[]>({
        repository: EventRepo,
        exposeToGQLAs: 'event_ids',
        exposeToConfig: true,
    })
    private _event_ids: ObjectId[] = [];

    @Field<ObjectId[]>({
        repository: ConditionRuleRepo,
        exposeToGQLAs: 'condition_rule_ids',
        exposeToConfig: true,
    })
    private _condition_rule_ids: ObjectId[] = [];

    @Field<ObjectId[]>({
        repository: ConditionRuleRepo,
        exposeToGQLAs: 'exception_rule_ids',
        exposeToConfig: true,
    })
    private _exception_rule_ids: ObjectId[] = [];

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

    get orgId(): ObjectId {
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

    get tagManagerAccountId(): ObjectId {
        return this._tag_manager_account_id;
    }

    get appId(): ObjectId {
        return this._app_id;
    }

    get revisionId(): ObjectId {
        return this._revision_id;
    }

    get eventIds(): ObjectId[] {
        return this._event_ids;
    }

    set eventIds(value: ObjectId[]) {
        this._event_ids = value;
    }

    get conditionRuleIds(): ObjectId[] {
        return this._condition_rule_ids;
    }

    set conditionRuleIds(value: ObjectId[]) {
        this._condition_rule_ids = value;
    }

    get exceptionRuleIds(): ObjectId[] {
        return this._exception_rule_ids;
    }

    set exceptionRuleIds(value: ObjectId[]) {
        this._exception_rule_ids = value;
    }
}
