import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectId } from 'mongodb';
import App from './App';
import AppPlatformRevisionRepo from '../../repos/tag/AppPlatformRevisionRepo';
import TagRepo from '../../repos/tag/TagRepo';
import TriggerRepo from '../../repos/tag/TriggerRepo';
import ActionGroupDistributionRepo from '../../repos/tag/ActionGroupDistributionRepo';

export default class Revision extends Model {
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
        exposeToGQLAs: 'parent_revision_id',
    })
    private _parent_revision_id?: ObjectId;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'tag_manager_account_id',
    })
    private readonly _tag_manager_account_id!: ObjectId;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'app_id',
    })
    private _app_id!: ObjectId;

    @Field<ObjectId[]>({
        repository: AppPlatformRevisionRepo,
        required: true,
        exposeToGQLAs: 'app_platform_revision_ids',
        exposeToConfig: true,
    })
    private _app_platform_revision_ids: ObjectId[] = [];

    @Field<ObjectId[]>({
        repository: TagRepo,
        required: true,
        exposeToGQLAs: 'tag_ids',
        exposeToConfig: true,
    })
    private _tag_ids: ObjectId[] = [];

    @Field<ObjectId[]>({
        repository: TriggerRepo,
        required: true,
        exposeToGQLAs: 'global_trigger_ids',
        exposeToConfig: true,
    })
    private _global_trigger_ids: ObjectId[] = [];

    @Field<ObjectId[]>({
        repository: ActionGroupDistributionRepo,
        required: true,
        exposeToGQLAs: 'global_action_group_distribution_ids',
        exposeToConfig: true,
    })
    private _global_action_group_distribution_ids: ObjectId[] = [];

    @Field<boolean>({
        required: true,
        defaultValue: () => false,
        exposeToGQLAs: 'locked',
    })
    private _is_final!: boolean;

    constructor(name: string, app: App) {
        super();
        this._name = name;
        if (app !== undefined) {
            this._org_id = app.orgId;
            this._tag_manager_account_id = app.tagManagerAccountId;
            this._app_id = app.id;
        }
    }

    get parentRevisionId(): ObjectId | undefined {
        return this._parent_revision_id;
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

    get appPlatformRevisionIds(): ObjectId[] {
        return this._app_platform_revision_ids;
    }

    set appPlatformRevisionIds(value: ObjectId[]) {
        this._app_platform_revision_ids = value;
    }

    get appId(): ObjectId {
        return this._app_id;
    }

    set appId(value: ObjectId) {
        this._app_id = value;
    }

    get tagIds(): ObjectId[] {
        return this._tag_ids;
    }

    set tagIds(value: ObjectId[]) {
        this._tag_ids = value;
    }

    get globalTriggerIds(): ObjectId[] {
        return this._global_trigger_ids;
    }

    set globalTriggerIds(value: ObjectId[]) {
        this._global_trigger_ids = value;
    }

    get globalActionGroupDistributionIds(): ObjectId[] {
        return this._global_action_group_distribution_ids;
    }

    set globalActionGroupDistributionIds(value: ObjectId[]) {
        this._global_action_group_distribution_ids = value;
    }

    get isFinal(): boolean {
        return this._is_final;
    }

    set isFinal(value: boolean) {
        this._is_final = value;
    }
}
