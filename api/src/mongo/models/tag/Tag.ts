import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import RuleGroup from './RuleGroup';
import Revision from './Revision';
import RuleGroupRepo from '../../repos/tag/RuleGroupRepo';
import Hash from '../../../core/Hash';
import { TagType } from '../../../enums/TagType';

export default class Tag extends Model {
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

    @Field<string>({
        required: true, //this will be auto populated on save...
        defaultValue: () => Hash.simpleRandomHash(10),
        exposeToGQLAs: 'tag_code',
        exposeToConfig: true,
    })
    private readonly _tag_code!: string;

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

    @Field<TagType>({
        required: true,
        exposeToGQLAs: 'type',
        exposeToConfig: true,
    })
    private readonly _type: TagType;

    @Field<number>({
        required: true,
        exposeToGQLAs: 'width',
        exposeToConfig: true,
    })
    private _width: number;

    @Field<number>({
        required: true,
        exposeToGQLAs: 'height',
        exposeToConfig: true,
    })
    private _height: number;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'is_active',
        exposeToConfig: true,
    })
    private _is_active: boolean;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'auto_load',
        exposeToConfig: true,
    })
    private _auto_load: boolean;

    @Field<ObjectID[]>({
        repository: RuleGroupRepo,
        required: true,
        exposeToGQLAs: 'rule_group_id',
        exposeToConfig: true,
    })
    private _rule_group_ids: ObjectID[];

    constructor(
        name: string,
        type: TagType,
        width: number,
        height: number,
        revision: Revision,
        autoLoad: boolean,
        ruleGroups: RuleGroup[] = [],
    ) {
        super();
        this._name = name;
        this._type = type;
        this._width = width;
        this._height = height;
        if (revision !== undefined) {
            this._org_id = revision.orgId;
            this._tag_manager_account_id = revision.tagManagerAccountId;
            this._app_id = revision.appId;
            this._revision_id = revision.id;
        }
        this._auto_load = autoLoad;
        this._rule_group_ids = ruleGroups.map((_) => _.id);
        this._is_active = true;
    }

    get orgId(): ObjectID {
        return this._org_id;
    }

    get tagCode(): string {
        return this._tag_code;
    }

    get type(): TagType {
        return this._type;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get autoLoad(): boolean {
        return this._auto_load;
    }

    set autoLoad(value: boolean) {
        this._auto_load = value;
    }

    get revisionId(): ObjectID {
        return this._revision_id;
    }

    get tagManagerAccountId(): ObjectID {
        return this._tag_manager_account_id;
    }

    get appId(): ObjectID {
        return this._app_id;
    }

    get ruleGroupIds(): ObjectID[] {
        return this._rule_group_ids;
    }

    set ruleGroupIds(value: ObjectID[]) {
        this._rule_group_ids = value;
    }
}
