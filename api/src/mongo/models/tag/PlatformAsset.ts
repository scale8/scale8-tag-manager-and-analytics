import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import PlatformRevision from './PlatformRevision';

export default class PlatformAsset extends Model {
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
        platformAutoMerge: true, //change here will not cause any conflicts in behaviour
        exposeToConfig: true,
    })
    private readonly _name: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'mime_type',
        platformAutoMerge: true, //change here will not cause any conflicts in behaviour
        exposeToConfig: true,
    })
    private readonly _mime_type: string;

    @Field<number>({
        required: true,
        exposeToGQLAs: 'size',
        platformAutoMerge: true, //change here will not cause any conflicts in behaviour
    })
    private readonly _size: number;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'is_primary',
        platformAutoMerge: true, //change here will not cause any conflicts in behaviour
        defaultValue: () => false,
        exposeToConfig: true,
    })
    private _is_primary: boolean;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'tag_manager_account_id',
    })
    private readonly _tag_manager_account_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'platform_id',
        exposeToConfig: true,
    })
    private readonly _platform_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'platform_revision_id',
        exposeToConfig: true,
    })
    private readonly _revision_id!: ObjectID;

    constructor(
        name: string,
        platformRevision: PlatformRevision,
        mimeType: string,
        size: number,
        isPrimary = false,
    ) {
        super();
        this._name = name;
        if (platformRevision !== undefined) {
            this._org_id = platformRevision.orgId;
            this._tag_manager_account_id = platformRevision.tagManagerAccountId;
            this._platform_id = platformRevision.platformId;
            this._revision_id = platformRevision.id;
        }
        this._mime_type = mimeType;
        this._size = size;
        this._is_primary = isPrimary;
    }

    get orgId(): ObjectID {
        return this._org_id;
    }

    get name(): string {
        return this._name;
    }

    get tagManagerAccountId(): ObjectID {
        return this._tag_manager_account_id;
    }

    get platformId(): ObjectID {
        return this._platform_id;
    }

    get platformRevisionId(): ObjectID {
        return this._revision_id;
    }

    get mimeType(): string {
        return this._mime_type;
    }

    get size(): number {
        return this._size;
    }

    set isPrimary(value: boolean) {
        this._is_primary = value;
    }

    get isPrimary(): boolean {
        return this._is_primary;
    }
}
