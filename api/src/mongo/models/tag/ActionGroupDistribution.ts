import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import Revision from './Revision';
import ActionGroupRepo from '../../repos/tag/ActionGroupRepo';
import ActionGroup from './ActionGroup';
import { RevisionEntityParentType } from '../../../enums/RevisionEntityParentType';
import { ActionGroupDistributionType } from '../../../enums/ActionGroupDistributionType';

export default class ActionGroupDistribution extends Model {
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

    @Field<ActionGroupDistributionType>({
        required: true,
        exposeToGQLAs: 'action_group_distribution_type',
        exposeToConfig: true,
    })
    private _action_group_distribution_type: ActionGroupDistributionType;

    @Field<ObjectID>({
        repository: ActionGroupRepo,
        exposeToGQLAs: 'action_ids',
        exposeToConfig: true,
    })
    private _action_group_ids: ObjectID[] = [];

    constructor(
        name: string,
        parentType: RevisionEntityParentType,
        revision: Revision,
        actionsGroups: ActionGroup[] = [],
        actionGroupDistributionType: ActionGroupDistributionType = ActionGroupDistributionType.NONE,
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
        this._action_group_ids = actionsGroups.map((e) => e.id);
        this._action_group_distribution_type = actionGroupDistributionType;
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

    get actionGroupIds(): ObjectID[] {
        return this._action_group_ids;
    }

    set actionGroupIds(value: ObjectID[]) {
        this._action_group_ids = value;
    }
}
