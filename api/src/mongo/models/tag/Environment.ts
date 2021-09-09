import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import Revision from './Revision';
import App from './App';
import EnvironmentVariable from '../EnvironmentVariable';
import EnvironmentVariableRepo from '../../repos/EnvironmentVariableRepo';

export default class Environment extends Model {
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
    private _name: string;

    @Field<string>({
        exposeToGQLAs: 'url',
    })
    private _url?: string;

    @Field<string>({
        exposeToGQLAs: 'custom_domain',
    })
    private _custom_domain?: string;

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
        exposeToGQLAs: 'revision_id',
    })
    private _revision_id!: ObjectID;

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
        customDomain?: string,
    ) {
        super();
        this._name = name;
        this._url = url;
        this._custom_domain = customDomain;
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

    get orgId(): ObjectID {
        return this._org_id;
    }

    get appId(): ObjectID {
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

    get tagManagerAccountId(): ObjectID {
        return this._tag_manager_account_id;
    }

    get revisionId(): ObjectID {
        return this._revision_id;
    }

    set revisionId(value: ObjectID) {
        this._revision_id = value;
    }

    get environmentVariables(): EnvironmentVariable[] {
        return this._env_vars;
    }

    set environmentVariables(value: EnvironmentVariable[]) {
        this._env_vars = value;
    }
}
