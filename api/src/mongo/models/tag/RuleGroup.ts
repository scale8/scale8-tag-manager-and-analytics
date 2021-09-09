import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import Rule from './Rule';
import Revision from './Revision';
import RuleRepo from '../../repos/tag/RuleRepo';

export default class RuleGroup extends Model {
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

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'is_active',
        exposeToConfig: true,
    })
    private _is_active: boolean;

    @Field<ObjectID>({
        repository: RuleRepo,
        exposeToGQLAs: 'rule_ids',
        exposeToConfig: true,
    })
    private _rule_ids: ObjectID[] = [];

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

    get orgId(): ObjectID {
        return this._org_id;
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

    get ruleIds(): ObjectID[] {
        return this._rule_ids;
    }

    set ruleIds(value: ObjectID[]) {
        this._rule_ids = value;
    }
}
