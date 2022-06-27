import { inject, injectable } from 'inversify';
import { DocumentNode } from 'graphql';
import Model from '../mongo/abstractions/Model';
import Repo from '../mongo/abstractions/Repo';
import TYPES from '../container/IOC.types';
import RepoFromManagerFactory from '../container/factoryTypes/RepoFromManagerFactory';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import UserAuth from '../auth/UserAuth';
import OrgAuth from '../auth/OrgAuth';
import ModelFromRepoFactory from '../container/factoryTypes/ModelFromRepoFactory';
import RepoFromRepoNameFactory from '../container/factoryTypes/RepoFromRepoNameFactory';
import Shell from '../mongo/database/Shell';
import BaseLogger from '../backends/logging/abstractions/BaseLogger';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';

@injectable()
export default abstract class Manager<T extends Model> {
    protected readonly repo: Repo<T>;
    protected readonly shell: Shell;
    protected readonly logger: BaseLogger;
    protected readonly config: BaseConfig;
    protected readonly modelFromRepoFactory: ModelFromRepoFactory;
    protected readonly repoFromNameFactory: RepoFromRepoNameFactory;
    protected readonly repoFactory: RepoFromModelFactory;
    protected readonly userAuth: UserAuth;
    protected readonly orgAuth: OrgAuth;

    public constructor(
        @inject(TYPES.Shell) shell: Shell,
        @inject(TYPES.BackendLogger) logger: BaseLogger,
        @inject(TYPES.BackendConfig) config: BaseConfig,
        @inject(TYPES.ModelFromRepoFactory) modelFactory: ModelFromRepoFactory,
        @inject(TYPES.RepoFromManagerFactory) repoFromManagerFactory: RepoFromManagerFactory,
        @inject(TYPES.RepoFromModelFactory) repoFactory: RepoFromModelFactory,
        @inject(TYPES.UserAuth) userAuth: UserAuth,
        @inject(TYPES.OrgAuth) orgAuth: OrgAuth,
        @inject(TYPES.RepoFromRepoNameFactory) repoFromNameFactory: RepoFromRepoNameFactory,
    ) {
        this.repo = repoFromManagerFactory(this.constructor.name);
        this.shell = shell;
        this.logger = logger;
        this.config = config;
        this.modelFromRepoFactory = modelFactory;
        this.repoFactory = repoFactory;
        this.repoFromNameFactory = repoFromNameFactory;
        this.userAuth = userAuth;
        this.orgAuth = orgAuth;
    }

    // GQL Properties and Accessors

    protected gqlSchema: DocumentNode | null = null;
    protected gqlExtendedQueryResolvers: { [k: string]: any } = {};
    protected gqlExtendedMutationResolvers: { [k: string]: any } = {};
    protected gqlCustomResolvers: { [k: string]: any } = {};

    public getGQLSchema(): DocumentNode | null {
        return this.gqlSchema;
    }

    public getExtendedGQLQueryResolvers(): Record<string, unknown> {
        return this.gqlExtendedQueryResolvers;
    }

    public getExtendedGQLMutationResolvers(): Record<string, unknown> {
        return this.gqlExtendedMutationResolvers;
    }

    public getGQLCustomResolvers(): Record<string, unknown> {
        return this.gqlCustomResolvers;
    }
}
