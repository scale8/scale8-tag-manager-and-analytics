import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectId } from 'mongodb';
import Revision from './Revision';
import App from './App';
import EnvironmentVariable from '../EnvironmentVariable';
import EnvironmentVariableRepo from '../../repos/EnvironmentVariableRepo';

export default class Environment extends Model {
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
    })
    private _name: string;

    @Field<string>({
        exposeToGQLAs: 'url',
    })
    private _url?: string;

    @Field<string>({
        exposeToGQLAs: 'custom_domain',
    })
    private _custom_domain?: string;

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
        exposeToGQLAs: 'revision_id',
    })
    private _revision_id!: ObjectId;

    @Field<EnvironmentVariable[]>({
        repository: EnvironmentVariableRepo,
        required: true,
    })
    private _env_vars: EnvironmentVariable[] = [];

    constructor(
        name: string,
        app: App,
        revision: Revision,
        url?: string,
        environmentVariables: EnvironmentVariable[] = [],
    ) {
        super();
        this._name = name;
        this._url = url;
        if (app !== undefined) {
            this._org_id = app.orgId;
            this._tag_manager_account_id = app.tagManagerAccountId;
            this._app_id = app.id;
        }
        if (revision !== undefined) {
            this._revision_id = revision.id;
        }
        this._env_vars = environmentVariables;
    }

    get orgId(): ObjectId {
        return this._org_id;
    }

    get appId(): ObjectId {
        return this._app_id;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get url(): string | undefined {
        return this._url;
    }

    set url(value: string | undefined) {
        this._url = value;
    }

    get customDomain(): string | undefined {
        return this._custom_domain;
    }

    set customDomain(value: string | undefined) {
        this._custom_domain = value;
    }

    get tagManagerAccountId(): ObjectId {
        return this._tag_manager_account_id;
    }

    get revisionId(): ObjectId {
        return this._revision_id;
    }

    set revisionId(value: ObjectId) {
        this._revision_id = value;
    }

    get environmentVariables(): EnvironmentVariable[] {
        return this._env_vars;
    }

    set environmentVariables(value: EnvironmentVariable[]) {
        this._env_vars = value;
    }
}
