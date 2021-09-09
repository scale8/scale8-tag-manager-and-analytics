import Model from '../abstractions/Model';
import Field from '../decorators/Field';
import { ObjectID } from 'mongodb';
import PermissionGroup from './PermissionGroup';
import Org from './Org';
import User from './User';
import PermissionGroupRepo from '../repos/PermissionGroupRepo';

export default class OrgRole extends Model {
    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'user_id',
    })
    private _user_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'org_id',
    })
    private _org_id!: ObjectID;

    @Field<PermissionGroup>({
        repository: PermissionGroupRepo,
        required: true,
    })
    private _permission_group: PermissionGroup;

    constructor(org: Org, user: User, permissionGroup = new PermissionGroup()) {
        super();
        //as we are creating this from db, account and user can be undefined
        if (org !== undefined) {
            this._org_id = org.id;
            this._user_id = user.id;
        }
        this._permission_group = permissionGroup;
    }

    get userId(): ObjectID {
        return this._user_id;
    }

    set userId(value: ObjectID) {
        this._user_id = value;
    }

    get orgId(): ObjectID {
        return this._org_id;
    }

    set orgId(value: ObjectID) {
        this._org_id = value;
    }

    get permissionGroup(): PermissionGroup {
        return this._permission_group;
    }

    set permissionGroup(value: PermissionGroup) {
        this._permission_group = value;
    }
}
