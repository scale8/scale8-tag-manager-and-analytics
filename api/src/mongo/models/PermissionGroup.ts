import Model from '../abstractions/Model';
import Field from '../decorators/Field';

export default class PermissionGroup extends Model {
    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'can_view',
        defaultValue: () => true,
    })
    private _can_view: boolean;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'can_create',
        defaultValue: () => true,
    })
    private _can_create: boolean;

    @Field<boolean>({
        required: true,
        defaultValue: () => true,
        exposeToGQLAs: 'can_edit',
    })
    private _can_edit: boolean;

    @Field<boolean>({
        required: true,
        defaultValue: () => true,
        exposeToGQLAs: 'can_delete',
    })
    private _can_delete: boolean;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'is_admin',
        defaultValue: () => false,
    })
    private _is_admin: boolean;

    constructor(
        canView = true,
        canCreate = true,
        canEdit = true,
        canDelete = true,
        isAdmin = false,
    ) {
        super();
        this._can_view = canView;
        this._can_create = canCreate;
        this._can_edit = canEdit;
        this._can_delete = canDelete;
        this._is_admin = isAdmin;
    }

    get canView(): boolean {
        return this._can_view;
    }

    set canView(value: boolean) {
        this._can_view = value;
    }

    get canCreate(): boolean {
        return this._can_create;
    }

    set canCreate(value: boolean) {
        this._can_create = value;
    }

    get canEdit(): boolean {
        return this._can_edit;
    }

    set canEdit(value: boolean) {
        this._can_edit = value;
    }

    get canDelete(): boolean {
        return this._can_delete;
    }

    set canDelete(value: boolean) {
        this._can_delete = value;
    }

    get isAdmin(): boolean {
        return this._is_admin;
    }

    set isAdmin(value: boolean) {
        this._is_admin = value;
    }
}
