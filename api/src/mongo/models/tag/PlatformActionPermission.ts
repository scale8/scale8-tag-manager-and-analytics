import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import PlatformRevision from './PlatformRevision';
import DatabaseError from '../../../errors/DatabaseError';
import ScalarContainer from '../../custom/ScalarContainer';
import userMessages from '../../../errors/UserMessages';
import { PlatformActionPermissionRequest } from '../../../enums/PlatformActionPermissionRequest';
import { PlatformActionPermissionURLParts } from '../../../enums/PlatformActionPermissionURLParts';

type VariableReadWriteExecuteScope = {
    name: string;
    read: boolean;
    write: boolean;
    execute: boolean;
};

export default class PlatformActionPermission extends Model {
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
    })
    private readonly _name: string;

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

    @Field<PlatformActionPermissionRequest>({
        required: true,
        exposeToGQLAs: 'permission',
        exposeToConfig: true,
    })
    private _permission: PlatformActionPermissionRequest;

    @Field<ScalarContainer<string>>({
        required: false,
        exposeToGQLAs: 'variable_read_write_scopes',
        exposeToConfig: true,
    })
    private _variable_read_write_execute_scopes?: ScalarContainer<string>;

    @Field<ScalarContainer<PlatformActionPermissionURLParts>>({
        required: false,
        exposeToGQLAs: 'url_parts',
        exposeToConfig: true,
    })
    private _url_parts?: ScalarContainer<PlatformActionPermissionURLParts>;

    @Field<ScalarContainer<string>>({
        required: false,
        exposeToGQLAs: 'host_matches',
        exposeToConfig: true,
    })
    private _host_matches?: ScalarContainer<string>;

    @Field<ScalarContainer<string>>({
        required: false,
        exposeToGQLAs: 'event_names',
        exposeToConfig: true,
    })
    private _event_names?: ScalarContainer<string>;

    constructor(
        permission: PlatformActionPermissionRequest,
        platformRevision: PlatformRevision,
        variableReadWriteExecuteScope?: VariableReadWriteExecuteScope[],
        urlParts?: PlatformActionPermissionURLParts[],
        hostMatches?: string[],
        eventNames?: string[],
    ) {
        super();
        this._name = permission;
        this._permission = permission;
        if (platformRevision !== undefined) {
            this._org_id = platformRevision.orgId;
            this._tag_manager_account_id = platformRevision.tagManagerAccountId;
            this._platform_id = platformRevision.platformId;
            this._revision_id = platformRevision.id;
        }
        if (
            permission === PlatformActionPermissionRequest.GLOBAL_VARIABLE ||
            permission === PlatformActionPermissionRequest.LOCAL_STORAGE ||
            permission === PlatformActionPermissionRequest.COOKIE ||
            permission === PlatformActionPermissionRequest.DATA_LAYER
        ) {
            //we need one or more rw scopes for keys...
            if (
                variableReadWriteExecuteScope === undefined ||
                variableReadWriteExecuteScope.length === 0
            ) {
                throw new DatabaseError(userMessages.permissionNoRWScope(permission), true);
            } else {
                this._variable_read_write_execute_scopes = new ScalarContainer<string>(
                    ...variableReadWriteExecuteScope.map((scope) => {
                        if (scope.name.match(/^[a-zA-Z0-9_-]+$/)) {
                            return JSON.stringify(scope);
                        } else {
                            throw new DatabaseError(userMessages.variableNameInvalid, true);
                        }
                    }),
                );
            }
        } else if (
            permission === PlatformActionPermissionRequest.READ_REFERRER_URL ||
            permission === PlatformActionPermissionRequest.READ_PAGE_URL
        ) {
            if (urlParts === undefined || urlParts.length === 0) {
                throw new DatabaseError(userMessages.permissionMissingUrl(permission), true);
            } else {
                this._url_parts = new ScalarContainer<PlatformActionPermissionURLParts>(
                    ...urlParts.filter((v, i, a) => a.indexOf(v) === i),
                );
            }
        } else if (
            permission === PlatformActionPermissionRequest.CREATE_IFRAME ||
            permission === PlatformActionPermissionRequest.IMAGE_PIXEL ||
            permission === PlatformActionPermissionRequest.INJECT_JAVASCRIPT
        ) {
            if (hostMatches === undefined || hostMatches.length === 0) {
                throw new DatabaseError(userMessages.permissionMissingHostMatch(permission), true);
            } else {
                this._host_matches = new ScalarContainer<string>(...hostMatches);
            }
        } else if (
            permission === PlatformActionPermissionRequest.LISTEN_EVENT ||
            permission === PlatformActionPermissionRequest.EMIT_EVENT
        ) {
            if (eventNames === undefined || eventNames.length === 0) {
                throw new DatabaseError(userMessages.permissionMissingEventName(permission), true);
            } else {
                this._event_names = new ScalarContainer<string>(...eventNames);
            }
        }
    }

    get orgId(): ObjectID {
        return this._org_id;
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

    get variableReadWriteScopes(): VariableReadWriteExecuteScope[] | undefined {
        return this._variable_read_write_execute_scopes?.arr.map(
            (_) => JSON.parse(_) as VariableReadWriteExecuteScope,
        );
    }

    get urlParts(): PlatformActionPermissionURLParts[] | undefined {
        return this._url_parts?.arr;
    }

    get hostMatches(): string[] | undefined {
        return this._host_matches?.arr;
    }

    get eventNames(): string[] | undefined {
        return this._event_names?.arr;
    }
}
