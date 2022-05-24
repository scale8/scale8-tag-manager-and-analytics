import Model from '../abstractions/Model';
import Field from '../decorators/Field';
import { ObjectId } from 'mongodb';
import PermissionGroup from './PermissionGroup';
import PermissionGroupRepo from '../repos/PermissionGroupRepo';
import Hash from '../../core/Hash';

export default class Invite extends Model {
    @Field<string>({
        required: true,
    })
    private readonly _token: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'email',
        validation: (value) => value.match(/.+@.+/) !== null,
    })
    private readonly _email: string;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'org_id',
    })
    private readonly _org_id!: ObjectId;

    @Field<PermissionGroup>({
        repository: PermissionGroupRepo,
        required: true,
    })
    private readonly _org_permission_group: PermissionGroup;

    constructor(
        email: string,
        orgId: ObjectId,
        orgPermissions: PermissionGroup = new PermissionGroup(true, false, false, false, false),
    ) {
        super();
        this._org_id = orgId;
        this._email = email;
        this._org_permission_group = orgPermissions;
        this._token = Hash.simpleRandomHash();
    }

    get email(): string {
        return this._email;
    }

    get orgId(): ObjectId {
        return this._org_id;
    }

    get orgPermissionGroup(): PermissionGroup {
        return this._org_permission_group;
    }

    get token(): string {
        return this._token;
    }
}
