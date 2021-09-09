import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from './IOC.types';
import UserManager from '../managers/UserManager';
import ResolverRegister from '../gql/ResolverRegister';
import TypeDefRegister from '../gql/TypeDefRegister';
import Shell from '../mongo/database/Shell';
import UserRepo from '../mongo/repos/UserRepo';
import OrgRepo from '../mongo/repos/OrgRepo';
import OrgManager from '../managers/OrgManager';
import AuditRepo from '../mongo/repos/AuditRepo';
import AuditManager from '../managers/AuditManager';
import AppRepo from '../mongo/repos/tag/AppRepo';
import EventRepo from '../mongo/repos/tag/EventRepo';
import RevisionRepo from '../mongo/repos/tag/RevisionRepo';
import TagRepo from '../mongo/repos/tag/TagRepo';
import RevisionManager from '../managers/tag/RevisionManager';
import User from '../mongo/models/User';
import { ChainDependenciesBinder, ChainedDependency } from './ChainDependenciesBinder';
import Org from '../mongo/models/Org';
import Audit from '../mongo/models/Audit';
import App from '../mongo/models/tag/App';
import Event from '../mongo/models/tag/Event';
import Revision from '../mongo/models/tag/Revision';
import Tag from '../mongo/models/tag/Tag';
import Platform from '../mongo/models/tag/Platform';
import PlatformRepo from '../mongo/repos/tag/PlatformRepo';
import AppManager from '../managers/tag/AppManager';
import UserAuth from '../auth/UserAuth';
import Environment from '../mongo/models/tag/Environment';
import EnvironmentRepo from '../mongo/repos/tag/EnvironmentRepo';
import TagManager from '../managers/tag/TagManager';
import EnvironmentManager from '../managers/tag/EnvironmentManager';
import RuleRepo from '../mongo/repos/tag/RuleRepo';
import Rule from '../mongo/models/tag/Rule';
import RuleGroup from '../mongo/models/tag/RuleGroup';
import RuleGroupRepo from '../mongo/repos/tag/RuleGroupRepo';
import PlatformDataContainer from '../mongo/models/tag/PlatformDataContainer';
import PlatformDataContainerRepo from '../mongo/repos/tag/PlatformDataContainerRepo';
import PlatformEventRepo from '../mongo/repos/tag/PlatformEventRepo';
import PlatformEvent from '../mongo/models/tag/PlatformEvent';
import PlatformActionRepo from '../mongo/repos/tag/PlatformActionRepo';
import PlatformAction from '../mongo/models/tag/PlatformAction';
import PlatformDataMap from '../mongo/models/tag/PlatformDataMap';
import PlatformDataMapRepo from '../mongo/repos/tag/PlatformDataMapRepo';
import ActionRepo from '../mongo/repos/tag/ActionRepo';
import Action from '../mongo/models/tag/Action';
import ConditionRule from '../mongo/models/tag/ConditionRule';
import ConditionRuleRepo from '../mongo/repos/tag/ConditionRuleRepo';
import DataMap from '../mongo/models/tag/DataMap';
import DataMapRepo from '../mongo/repos/tag/DataMapRepo';
import OrgAuth from '../auth/OrgAuth';
import PlatformRevision from '../mongo/models/tag/PlatformRevision';
import PlatformRevisionRepo from '../mongo/repos/tag/PlatformRevisionRepo';
import AppPlatformRevision from '../mongo/models/tag/AppPlatformRevision';
import AppPlatformRevisionRepo from '../mongo/repos/tag/AppPlatformRevisionRepo';
import PlatformRevisionManager from '../managers/tag/PlatformRevisionManager';
import ActionGroup from '../mongo/models/tag/ActionGroup';
import ActionGroupRepo from '../mongo/repos/tag/ActionGroupRepo';
import PlatformManager from '../managers/tag/PlatformManager';
import PlatformDataContainerManager from '../managers/tag/PlatformDataContainerManager';
import PlatformEventManager from '../managers/tag/PlatformEventManager';
import PlatformActionManager from '../managers/tag/PlatformActionManager';
import PlatformDataMapManager from '../managers/tag/PlatformDataMapManager';
import ActionManager from '../managers/tag/ActionManager';
import ActionGroupManager from '../managers/tag/ActionGroupManager';
import ConditionRuleManager from '../managers/tag/ConditionRuleManager';
import DataMapManager from '../managers/tag/DataMapManager';
import RuleManager from '../managers/tag/RuleManager';
import RuleGroupManager from '../managers/tag/RuleGroupManager';
import EventManager from '../managers/tag/EventManager';
import Routing from '../express/Routing';
import GitHubAuth from '../express/handlers/GitHubAuth';
import PlatformAsset from '../mongo/models/tag/PlatformAsset';
import PlatformAssetManager from '../managers/tag/PlatformAssetManager';
import PlatformAssetRepo from '../mongo/repos/tag/PlatformAssetRepo';
import RevisionPreview from '../express/handlers/RevisionPreview';
import OrgRoleRepo from '../mongo/repos/OrgRoleRepo';
import OrgRole from '../mongo/models/OrgRole';
import UserNotification from '../mongo/models/UserNotification';
import UserNotificationRepo from '../mongo/repos/UserNotificationRepo';
import UserNotificationManager from '../managers/UserNotificationManager';
import Invite from '../mongo/models/Invite';
import InviteRepo from '../mongo/repos/InviteRepo';
import InviteManager from '../managers/InviteManager';
import PasswordReset from '../mongo/models/PasswordReset';
import PasswordResetRepo from '../mongo/repos/PasswordResetRepo';
import Render from '../twig/Render';
import Mailer from '../backends/email/Mailer';
import RepeatedDataMap from '../mongo/models/tag/RepeatedDataMap';
import RepeatedDataMapRepo from '../mongo/repos/tag/RepeatedDataMapRepo';
import Session from '../mongo/models/Session';
import SessionRepo from '../mongo/repos/SessionRepo';
import PermissionGroup from '../mongo/models/PermissionGroup';
import PermissionGroupRepo from '../mongo/repos/PermissionGroupRepo';
import AppPlatformRepo from '../mongo/repos/tag/AppPlatformRepo';
import AppPlatform from '../mongo/models/tag/AppPlatform';
import GitHub from '../mongo/models/GitHub';
import GitHubRepo from '../mongo/repos/GitHubRepo';
import ActionGroupDistribution from '../mongo/models/tag/ActionGroupDistribution';
import ActionGroupDistributionRepo from '../mongo/repos/tag/ActionGroupDistributionRepo';
import ActionGroupDistributionManager from '../managers/tag/ActionGroupDistributionManager';
import SignUpRequest from '../mongo/models/SignUpRequest';
import SignUpRequestRepo from '../mongo/repos/SignUpRequestRepo';
import AppPlatformRevisionManager from '../managers/tag/AppPlatformRevisionManager';
import S3Service from '../aws/S3Service';
import DataManagerAccount from '../mongo/models/data/DataManagerAccount';
import DataManagerAccountRepo from '../mongo/repos/data/DataManagerAccountRepo';
import DataManagerAccountManager from '../managers/data/DataManagerAccountManager';
import TagManagerAccount from '../mongo/models/tag/TagManagerAccount';
import TagManagerAccountRepo from '../mongo/repos/tag/TagManagerAccountRepo';
import TagManagerAccountManager from '../managers/tag/TagManagerAccountManager';
import IngestEndpointRepo from '../mongo/repos/data/IngestEndpointRepo';
import IngestEndpointManager from '../managers/data/IngestEndpointManager';
import IngestEndpoint from '../mongo/models/data/IngestEndpoint';
import IngestEndpointRevision from '../mongo/models/data/IngestEndpointRevision';
import IngestEndpointRevisionRepo from '../mongo/repos/data/IngestEndpointRevisionRepo';
import IngestEndpointRevisionManager from '../managers/data/IngestEndpointRevisionManager';
import IngestEndpointDataMap from '../mongo/models/data/IngestEndpointDataMap';
import IngestEndpointDataMapRepo from '../mongo/repos/data/IngestEndpointDataMapRepo';
import IngestEndpointDataMapManager from '../managers/data/IngestEndpointDataMapManager';
import IngestEndpointEnvironment from '../mongo/models/data/IngestEndpointEnvironment';
import IngestEndpointEnvironmentRepo from '../mongo/repos/data/IngestEndpointEnvironmentRepo';
import IngestEndpointEnvironmentManager from '../managers/data/IngestEndpointEnvironmentManager';
import EnvironmentVariable from '../mongo/models/EnvironmentVariable';
import EnvironmentVariableRepo from '../mongo/repos/EnvironmentVariableRepo';
import Route53Service from '../aws/Route53Service';
import Dependency from '../mongo/models/Dependency';
import DependencyRepo from '../mongo/repos/DependencyRepo';
import Ping from '../express/handlers/Ping';
import Trigger from '../mongo/models/tag/Trigger';
import TriggerRepo from '../mongo/repos/tag/TriggerRepo';
import TriggerManager from '../managers/tag/TriggerManager';
import PlatformActionPermission from '../mongo/models/tag/PlatformActionPermission';
import PlatformActionPermissionRepo from '../mongo/repos/tag/PlatformActionPermissionRepo';
import PlatformActionPermissionManager from '../managers/tag/PlatformActionPermissionManager';
import StripeService from '../payments/providers/StripeService';
import StripeWebhook from '../express/handlers/StripeWebhook';
import Usage from '../mongo/models/Usage';
import UsageRepo from '../mongo/repos/UsageRepo';
import UsageManager from '../managers/UsageManager';
import BaseStorage from '../backends/storage/abstractions/BaseStorage';
import MongoDBStorage from '../backends/storage/MongoDBStorage';
import BaseDatabase from '../backends/databases/abstractions/BaseDatabase';
import BaseLogger from '../backends/logging/abstractions/BaseLogger';
import BaseEmail from '../backends/email/abstractions/BaseEmail';
import ConsoleLogger from '../backends/logging/ConsoleLogger';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import EnvironmentConfig from '../backends/configuration/EnvironmentConfig';
import MongoDb from '../backends/databases/MongoDb';

const container = new Container();

//bind first, this is a core dep, with no further dependencies...
container.bind<Shell>(TYPES.Shell).to(Shell).inSingletonScope();

//pluggable
container.bind<BaseStorage>(TYPES.BackendStorage).to(MongoDBStorage).inSingletonScope();
container.bind<BaseDatabase>(TYPES.BackendDatabase).to(MongoDb).inSingletonScope();
container.bind<BaseLogger>(TYPES.BackendLogger).to(ConsoleLogger).inSingletonScope();
container.bind<BaseEmail>(TYPES.BackendEmail).to(Mailer).inSingletonScope();
container.bind<BaseConfig>(TYPES.BackendConfig).to(EnvironmentConfig).inSingletonScope();

container.bind<Render>(TYPES.Render).to(Render).inSingletonScope();
container.bind<Routing>(TYPES.Routing).to(Routing).inSingletonScope();
container.bind<S3Service>(TYPES.S3Service).to(S3Service).inSingletonScope();
container.bind<Route53Service>(TYPES.Route53Service).to(Route53Service).inSingletonScope();
container.bind<StripeService>(TYPES.StripeService).to(StripeService).inSingletonScope();
container.bind<StripeWebhook>(TYPES.StripeWebhook).to(StripeWebhook).inSingletonScope();
container.bind<GitHubAuth>(TYPES.GitHubAuth).to(GitHubAuth).inSingletonScope();
container.bind<RevisionPreview>(TYPES.RevisionPreview).to(RevisionPreview).inSingletonScope();
container.bind<Ping>(TYPES.Ping).to(Ping).inSingletonScope();
container.bind<ConsoleLogger>(TYPES.ConsoleLogger).to(ConsoleLogger).inSingletonScope();
container.bind<EnvironmentConfig>(TYPES.EnvironmentConfig).to(EnvironmentConfig).inSingletonScope();

[
    //gql
    { id: TYPES.ResolverRegister, constructor: ResolverRegister },
    { id: TYPES.TypeDefRegister, constructor: TypeDefRegister },
    //auth
    { id: TYPES.UserAuth, constructor: UserAuth },
    { id: TYPES.OrgAuth, constructor: OrgAuth },
].forEach((c) => {
    container.bind(c.id).to(c.constructor).inSingletonScope();
});

const chainedDependencies: ChainedDependency[] = [
    {
        model: Usage,
        repository: { id: TYPES.UsageRepo, constructor: UsageRepo },
        manager: { id: TYPES.UsageManager, constructor: UsageManager },
    },
    {
        model: User,
        repository: { id: TYPES.UserRepo, constructor: UserRepo },
        manager: { id: TYPES.UserManager, constructor: UserManager },
    },
    {
        model: DataManagerAccount,
        repository: { id: TYPES.DataManagerAccountRepo, constructor: DataManagerAccountRepo },
        manager: { id: TYPES.DataManagerAccountManager, constructor: DataManagerAccountManager },
    },
    {
        model: TagManagerAccount,
        repository: { id: TYPES.TagManagerAccountRepo, constructor: TagManagerAccountRepo },
        manager: { id: TYPES.TagManagerAccountManager, constructor: TagManagerAccountManager },
    },
    {
        model: Org,
        repository: { id: TYPES.OrgRepo, constructor: OrgRepo },
        manager: { id: TYPES.OrgManager, constructor: OrgManager },
    },
    {
        model: Audit,
        repository: { id: TYPES.AuditRepo, constructor: AuditRepo },
        manager: { id: TYPES.AuditManager, constructor: AuditManager },
    },
    {
        model: App,
        repository: { id: TYPES.AppRepo, constructor: AppRepo },
        manager: { id: TYPES.AppManager, constructor: AppManager },
    },
    {
        model: Event,
        repository: { id: TYPES.EventRepo, constructor: EventRepo },
        manager: { id: TYPES.EventManager, constructor: EventManager },
    },
    {
        model: Rule,
        repository: { id: TYPES.RuleRepo, constructor: RuleRepo },
        manager: { id: TYPES.RuleManager, constructor: RuleManager },
    },
    {
        model: Trigger,
        repository: { id: TYPES.TriggerRepo, constructor: TriggerRepo },
        manager: { id: TYPES.TriggerManager, constructor: TriggerManager },
    },
    {
        model: RuleGroup,
        repository: { id: TYPES.RuleGroupRepo, constructor: RuleGroupRepo },
        manager: { id: TYPES.RuleGroupManager, constructor: RuleGroupManager },
    },
    {
        model: PlatformDataContainer,
        repository: { id: TYPES.PlatformDataContainerRepo, constructor: PlatformDataContainerRepo },
        manager: {
            id: TYPES.PlatformDataContainerManager,
            constructor: PlatformDataContainerManager,
        },
    },
    {
        model: PlatformAsset,
        repository: { id: TYPES.PlatformAssetRepo, constructor: PlatformAssetRepo },
        manager: { id: TYPES.PlatformAssetManager, constructor: PlatformAssetManager },
    },
    {
        model: PlatformEvent,
        repository: { id: TYPES.PlatformEventRepo, constructor: PlatformEventRepo },
        manager: { id: TYPES.PlatformEventManager, constructor: PlatformEventManager },
    },
    {
        model: PlatformAction,
        repository: { id: TYPES.PlatformActionRepo, constructor: PlatformActionRepo },
        manager: { id: TYPES.PlatformActionManager, constructor: PlatformActionManager },
    },
    {
        model: PlatformActionPermission,
        repository: {
            id: TYPES.PlatformActionPermissionRepo,
            constructor: PlatformActionPermissionRepo,
        },
        manager: {
            id: TYPES.PlatformActionPermissionManager,
            constructor: PlatformActionPermissionManager,
        },
    },
    {
        model: PlatformDataMap,
        repository: { id: TYPES.PlatformDataMapRepo, constructor: PlatformDataMapRepo },
        manager: { id: TYPES.PlatformDataMapManager, constructor: PlatformDataMapManager },
    },
    {
        model: PlatformRevision,
        repository: { id: TYPES.PlatformRevisionRepo, constructor: PlatformRevisionRepo },
        manager: { id: TYPES.PlatformRevisionManager, constructor: PlatformRevisionManager },
    },
    {
        model: IngestEndpoint,
        repository: { id: TYPES.IngestEndpointRepo, constructor: IngestEndpointRepo },
        manager: { id: TYPES.IngestEndpointManager, constructor: IngestEndpointManager },
    },
    {
        model: IngestEndpointRevision,
        repository: {
            id: TYPES.IngestEndpointRevisionRepo,
            constructor: IngestEndpointRevisionRepo,
        },
        manager: {
            id: TYPES.IngestEndpointRevisionManager,
            constructor: IngestEndpointRevisionManager,
        },
    },
    {
        model: IngestEndpointDataMap,
        repository: { id: TYPES.IngestEndpointDataMapRepo, constructor: IngestEndpointDataMapRepo },
        manager: {
            id: TYPES.IngestEndpointDataMapManager,
            constructor: IngestEndpointDataMapManager,
        },
    },
    {
        model: IngestEndpointEnvironment,
        repository: {
            id: TYPES.IngestEndpointEnvironmentRepo,
            constructor: IngestEndpointEnvironmentRepo,
        },
        manager: {
            id: TYPES.IngestEndpointEnvironmentManager,
            constructor: IngestEndpointEnvironmentManager,
        },
    },
    {
        model: Action,
        repository: { id: TYPES.ActionRepo, constructor: ActionRepo },
        manager: { id: TYPES.ActionManager, constructor: ActionManager },
    },
    {
        model: ActionGroup,
        repository: { id: TYPES.ActionGroupRepo, constructor: ActionGroupRepo },
        manager: { id: TYPES.ActionGroupManager, constructor: ActionGroupManager },
    },
    {
        model: ActionGroupDistribution,
        repository: {
            id: TYPES.ActionGroupDistributionRepo,
            constructor: ActionGroupDistributionRepo,
        },
        manager: {
            id: TYPES.ActionGroupDistributionManager,
            constructor: ActionGroupDistributionManager,
        },
    },
    {
        model: ConditionRule,
        repository: { id: TYPES.ConditionRuleRepo, constructor: ConditionRuleRepo },
        manager: { id: TYPES.ConditionRuleManager, constructor: ConditionRuleManager },
    },
    {
        model: DataMap,
        repository: { id: TYPES.DataMapRepo, constructor: DataMapRepo },
        manager: { id: TYPES.DataMapManager, constructor: DataMapManager },
    },
    {
        model: Revision,
        repository: { id: TYPES.RevisionRepo, constructor: RevisionRepo },
        manager: { id: TYPES.RevisionManager, constructor: RevisionManager },
    },
    {
        model: Tag,
        repository: { id: TYPES.TagRepo, constructor: TagRepo },
        manager: { id: TYPES.TagManager, constructor: TagManager },
    },
    {
        model: Platform,
        repository: { id: TYPES.PlatformRepo, constructor: PlatformRepo },
        manager: { id: TYPES.PlatformManager, constructor: PlatformManager },
    },
    {
        model: AppPlatformRevision,
        repository: { id: TYPES.AppPlatformRevisionRepo, constructor: AppPlatformRevisionRepo },
        manager: { id: TYPES.AppPlatformRevisionManager, constructor: AppPlatformRevisionManager },
    },
    {
        model: OrgRole,
        repository: { id: TYPES.OrgRoleRepo, constructor: OrgRoleRepo },
        manager: null,
    },
    {
        model: PasswordReset,
        repository: { id: TYPES.PasswordResetRepo, constructor: PasswordResetRepo },
        manager: null,
    },
    {
        model: Environment,
        repository: { id: TYPES.EnvironmentRepo, constructor: EnvironmentRepo },
        manager: { id: TYPES.EnvironmentManager, constructor: EnvironmentManager },
    },
    {
        model: UserNotification,
        repository: { id: TYPES.NotificationRepo, constructor: UserNotificationRepo },
        manager: { id: TYPES.UserNotificationManager, constructor: UserNotificationManager },
    },
    {
        model: Invite,
        repository: { id: TYPES.InviteRepo, constructor: InviteRepo },
        manager: { id: TYPES.InviteManager, constructor: InviteManager },
    },
    {
        model: RepeatedDataMap,
        repository: { id: TYPES.RepeatedDataMapRepo, constructor: RepeatedDataMapRepo },
        manager: null,
    },
    {
        model: Session,
        repository: { id: TYPES.SessionRepo, constructor: SessionRepo },
        manager: null,
    },
    {
        model: EnvironmentVariable,
        repository: { id: TYPES.EnvironmentVariableRepo, constructor: EnvironmentVariableRepo },
        manager: null,
    },
    {
        model: PermissionGroup,
        repository: { id: TYPES.PermissionGroupRepo, constructor: PermissionGroupRepo },
        manager: null,
    },
    {
        model: AppPlatform,
        repository: { id: TYPES.AppPlatformRepo, constructor: AppPlatformRepo },
        manager: null,
    },
    {
        model: GitHub,
        repository: { id: TYPES.GitHubRepo, constructor: GitHubRepo },
        manager: null,
    },
    {
        model: Dependency,
        repository: { id: TYPES.DependencyRepo, constructor: DependencyRepo },
        manager: null,
    },
    {
        model: SignUpRequest,
        repository: { id: TYPES.SignUpRequestRepo, constructor: SignUpRequestRepo },
        manager: null,
    },
];

container.bind<ChainedDependency[]>(TYPES.ChainedDependencies).toConstantValue(chainedDependencies);

ChainDependenciesBinder.bindRepos(container, chainedDependencies);
ChainDependenciesBinder.bindManagers(container, chainedDependencies);
ChainDependenciesBinder.bindAllReposFactory(TYPES.AllReposFactory, container, chainedDependencies);
ChainDependenciesBinder.bindGQLManagersFactory(
    TYPES.GQLManagersFactory,
    container,
    chainedDependencies,
);
ChainDependenciesBinder.bindRepoFromModelFactory(
    TYPES.RepoFromModelFactory,
    container,
    chainedDependencies,
);
ChainDependenciesBinder.bindRepoFromManagerFactory(
    TYPES.RepoFromManagerFactory,
    container,
    chainedDependencies,
);
ChainDependenciesBinder.bindModelFromRepoFactory(
    TYPES.ModelFromRepoFactory,
    container,
    chainedDependencies,
);
ChainDependenciesBinder.bindRepoFromRepoNameFactory(
    TYPES.RepoFromRepoNameFactory,
    container,
    chainedDependencies,
);

export default container;
