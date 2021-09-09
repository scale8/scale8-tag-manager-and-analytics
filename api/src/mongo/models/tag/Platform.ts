import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import TagManagerAccount from './TagManagerAccount';
import { PlatformType } from '../../../enums/PlatformType';

export default class Platform extends Model {
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
        exposeToGQLAs: 'description',
    })
    private _description: string;

    @Field<string>({
        required: false,
        exposeToGQLAs: 'logo',
    })
    private _logo?: string;

    @Field<PlatformType>({
        required: true,
        exposeToGQLAs: 'type',
        exposeToConfig: true,
    })
    private readonly _type: PlatformType;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'is_core',
        exposeToConfig: true,
    })
    private readonly _is_core: boolean;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'is_public',
        exposeToConfig: true,
    })
    private _is_public: boolean;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'tag_manager_account_id',
    })
    private readonly _tag_manager_account_id!: ObjectID;

    constructor(
        type: PlatformType,
        name: string,
        description: string,
        tagManagerAccount: TagManagerAccount,
        logo?: string,
        isCore = false,
        isPublic = false,
    ) {
        super();
        this._type = type;
        this._name = name;
        this._description = description;
        this._logo = logo;
        if (tagManagerAccount !== undefined) {
            this._org_id = tagManagerAccount.orgId;
            this._tag_manager_account_id = tagManagerAccount.id;
        }
        this._is_core = isCore;
        this._is_public = isPublic; //we should encourage developers to make public once ready.
        //to make public it should meet several conditions, as we as having its first revision published.
        //we may want to also review what is being made public too!
    }

    get type(): PlatformType {
        return this._type;
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

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get logo(): string | undefined {
        return this._logo;
    }

    set logo(value: string | undefined) {
        this._logo = value;
    }

    get tagManagerAccountId(): ObjectID {
        return this._tag_manager_account_id;
    }

    get isCore(): boolean {
        return this._is_core;
    }

    get isPublic(): boolean {
        return this._is_public;
    }

    set isPublic(value: boolean) {
        this._is_public = value;
    }
}
