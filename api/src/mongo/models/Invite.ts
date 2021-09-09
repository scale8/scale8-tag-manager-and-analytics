import Model from '../abstractions/Model';
import Field from '../decorators/Field';
import { ObjectID } from 'mongodb';
import PermissionGroup from './PermissionGroup';
import PermissionGroupRepo from '../repos/PermissionGroupRepo';

export default class Invite extends Model {
    @Field<string>({
        required: true,
        exposeToGQLAs: 'email',
        validation: (value) => value.match(/.+@.+/) !== null,
    })
    private readonly _email: string;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'org_id',
    })
    private readonly _org_id!: ObjectID;

    @Field<PermissionGroup>({
        repository: PermissionGroupRepo,
        required: true,
    })
    private readonly _org_permission_group: PermissionGroup;

    constructor(
        email: string,
        orgId: ObjectID,
        orgPermissions: PermissionGroup = new PermissionGroup(true, false, false, false, false),
    ) {
        super();
        this._org_id = orgId;
        this._email = email;
        this._org_permission_group = orgPermissions;
    }

    get email(): string {
        return this._email;
    }

    get orgId(): ObjectID {
        return this._org_id;
    }

    get orgPermissionGroup(): PermissionGroup {
        return this._org_permission_group;
    }
}
