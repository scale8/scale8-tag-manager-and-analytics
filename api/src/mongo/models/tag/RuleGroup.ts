import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectId } from 'mongodb';
import Rule from './Rule';
import Revision from './Revision';
import RuleRepo from '../../repos/tag/RuleRepo';

export default class RuleGroup extends Model {
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

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'is_active',
        exposeToConfig: true,
    })
    private _is_active: boolean;

    @Field<ObjectId>({
        repository: RuleRepo,
        exposeToGQLAs: 'rule_ids',
        exposeToConfig: true,
    })
    private _rule_ids: ObjectId[] = [];

    constructor(name: string, revision: Revision, rules: Rule[] = []) {
        super();
        this._name = name;
        if (revision !== undefined) {
            this._org_id = revision.orgId;
            this._tag_manager_account_id = revision.tagManagerAccountId;
            this._app_id = revision.appId;
            this._revision_id = revision.id;
        }
        this._rule_ids = rules.map((e) => e.id);
        this._is_active = true;
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

    get tagManagerAccountId(): ObjectId {
        return this._tag_manager_account_id;
    }

    get appId(): ObjectId {
        return this._app_id;
    }

    get revisionId(): ObjectId {
        return this._revision_id;
    }

    get ruleIds(): ObjectId[] {
        return this._rule_ids;
    }

    set ruleIds(value: ObjectId[]) {
        this._rule_ids = value;
    }
}
