import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectId } from 'mongodb';
import Action from './Action';
import Revision from './Revision';
import ActionRepo from '../../repos/tag/ActionRepo';

export default class ActionGroup extends Model {
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
        repository: ActionRepo,
        exposeToGQLAs: 'action_ids',
        exposeToConfig: true,
    })
    private _action_ids: ObjectId[] = [];

    @Field<number>({
        required: true,
        exposeToGQLAs: 'distribution',
        exposeToConfig: true,
        validation: (_) => _ >= -1 && _ <= 1000,
    })
    private _distribution: number;

    @Field<number>({
        required: true,
        exposeToGQLAs: 'is_locked',
        exposeToConfig: true,
    })
    private _is_locked: boolean;

    constructor(
        name: string,
        revision: Revision,
        actions: Action[] = [],
        distribution = -1,
        isLocked = false,
    ) {
        super();
        this._name = name;
        if (revision !== undefined) {
            this._org_id = revision.orgId;
            this._tag_manager_account_id = revision.tagManagerAccountId;
            this._app_id = revision.appId;
            this._revision_id = revision.id;
        }
        this._action_ids = actions.map((e) => e.id);
        this._distribution = distribution;
        this._is_locked = isLocked;
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

    get actionIds(): ObjectId[] {
        return this._action_ids;
    }

    set actionIds(value: ObjectId[]) {
        this._action_ids = value;
    }

    get distribution(): number {
        return this._distribution;
    }

    set distribution(value: number) {
        this._distribution = value;
    }

    get isLocked(): boolean {
        return this._is_locked;
    }

    set isLocked(value: boolean) {
        this._is_locked = value;
    }
}
