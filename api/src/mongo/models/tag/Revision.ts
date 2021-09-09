import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import App from './App';
import AppPlatformRevisionRepo from '../../repos/tag/AppPlatformRevisionRepo';
import TagRepo from '../../repos/tag/TagRepo';
import TriggerRepo from '../../repos/tag/TriggerRepo';
import ActionGroupDistributionRepo from '../../repos/tag/ActionGroupDistributionRepo';

export default class Revision extends Model {
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
        exposeToGQLAs: 'parent_revision_id',
    })
    private _parent_revision_id?: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'tag_manager_account_id',
    })
    private readonly _tag_manager_account_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'app_id',
    })
    private _app_id!: ObjectID;

    @Field<ObjectID[]>({
        repository: AppPlatformRevisionRepo,
        required: true,
        exposeToGQLAs: 'app_platform_revision_ids',
        exposeToConfig: true,
    })
    private _app_platform_revision_ids: ObjectID[] = [];

    @Field<ObjectID[]>({
        repository: TagRepo,
        required: true,
        exposeToGQLAs: 'tag_ids',
        exposeToConfig: true,
    })
    private _tag_ids: ObjectID[] = [];

    @Field<ObjectID[]>({
        repository: TriggerRepo,
        required: true,
        exposeToGQLAs: 'global_trigger_ids',
        exposeToConfig: true,
    })
    private _global_trigger_ids: ObjectID[] = [];

    @Field<ObjectID[]>({
        repository: ActionGroupDistributionRepo,
        required: true,
        exposeToGQLAs: 'global_action_group_distribution_ids',
        exposeToConfig: true,
    })
    private _global_action_group_distribution_ids: ObjectID[] = [];

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

    get parentRevisionId(): ObjectID | undefined {
        return this._parent_revision_id;
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

    get appPlatformRevisionIds(): ObjectID[] {
        return this._app_platform_revision_ids;
    }

    set appPlatformRevisionIds(value: ObjectID[]) {
        this._app_platform_revision_ids = value;
    }

    get appId(): ObjectID {
        return this._app_id;
    }

    set appId(value: ObjectID) {
        this._app_id = value;
    }

    get tagIds(): ObjectID[] {
        return this._tag_ids;
    }

    set tagIds(value: ObjectID[]) {
        this._tag_ids = value;
    }

    get globalTriggerIds(): ObjectID[] {
        return this._global_trigger_ids;
    }

    set globalTriggerIds(value: ObjectID[]) {
        this._global_trigger_ids = value;
    }

    get globalActionGroupDistributionIds(): ObjectID[] {
        return this._global_action_group_distribution_ids;
    }

    set globalActionGroupDistributionIds(value: ObjectID[]) {
        this._global_action_group_distribution_ids = value;
    }

    get isFinal(): boolean {
        return this._is_final;
    }

    set isFinal(value: boolean) {
        this._is_final = value;
    }
}
