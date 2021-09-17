import MockDate from 'mockdate';
import container from '../../src/container/IOC.config';
import TYPES from '../../src/container/IOC.types';
import TypeDefRegister from '../../src/gql/TypeDefRegister';
import ResolverRegister from '../../src/gql/ResolverRegister';
import { ApolloServer } from 'apollo-server-express';
import AuthDirective from '../../src/gql/directives/AuthDirective';
import BaseLogger from '../../src/backends/logging/abstractions/BaseLogger';
import BaseConfig from '../../src/backends/configuration/abstractions/BaseConfig';
import Org from '../../src/mongo/models/Org';
import User from '../../src/mongo/models/User';
import { ObjectID } from 'mongodb';
import Audit from '../../src/mongo/models/Audit';
import OperationOwner from '../../src/enums/OperationOwner';
import AuditAction from '../../src/enums/AuditAction';
import GQLMethod from '../../src/enums/GQLMethod';
import Invite from '../../src/mongo/models/Invite';
import UserNotification from '../../src/mongo/models/UserNotification';
import { NotificationType } from '../../src/enums/NotificationType';
import DataManagerAccount from '../../src/mongo/models/data/DataManagerAccount';
import { AccountType } from '../../src/enums/AccountType';
import IngestEndpointDataMap from '../../src/mongo/models/data/IngestEndpointDataMap';
import IngestEndpointRevision from '../../src/mongo/models/data/IngestEndpointRevision';
import { VarType } from '../../src/enums/VarType';
import IngestEndpoint from '../../src/mongo/models/data/IngestEndpoint';
import TagManagerAccount from '../../src/mongo/models/tag/TagManagerAccount';
import IngestEndpointEnvironment from '../../src/mongo/models/data/IngestEndpointEnvironment';
import { StorageProvider } from '../../src/enums/StorageProvider';
import Model from '../../src/mongo/abstractions/Model';
import Trigger from '../../src/mongo/models/tag/Trigger';
import Revision from '../../src/mongo/models/tag/Revision';
import App from '../../src/mongo/models/tag/App';
import { RevisionEntityParentType } from '../../src/enums/RevisionEntityParentType';
import Tag from '../../src/mongo/models/tag/Tag';
import { TagType } from '../../src/enums/TagType';
import Rule from '../../src/mongo/models/tag/Rule';
import RuleGroup from '../../src/mongo/models/tag/RuleGroup';
import Event from '../../src/mongo/models/tag/Event';
import PlatformEvent from '../../src/mongo/models/tag/PlatformEvent';
import PlatformRevision from '../../src/mongo/models/tag/PlatformRevision';
import Platform from '../../src/mongo/models/tag/Platform';
import { PlatformType } from '../../src/enums/PlatformType';
import Environment from '../../src/mongo/models/tag/Environment';
import DataMap from '../../src/mongo/models/tag/DataMap';
import ConditionRule from '../../src/mongo/models/tag/ConditionRule';
import PlatformDataContainer from '../../src/mongo/models/tag/PlatformDataContainer';
import { ConditionType } from '../../src/enums/ConditionType';
import AppPlatformRevision from '../../src/mongo/models/tag/AppPlatformRevision';
import Action from '../../src/mongo/models/tag/Action';
import PlatformAction from '../../src/mongo/models/tag/PlatformAction';
import ActionGroup from '../../src/mongo/models/tag/ActionGroup';
import ActionGroupDistribution from '../../src/mongo/models/tag/ActionGroupDistribution';
import PlatformDataMap from '../../src/mongo/models/tag/PlatformDataMap';
import PlatformAsset from '../../src/mongo/models/tag/PlatformAsset';
import PlatformActionPermission from '../../src/mongo/models/tag/PlatformActionPermission';
import { PlatformActionPermissionRequest } from '../../src/enums/PlatformActionPermissionRequest';
import { InputType } from '../../../common/enums/InputType';

jest.mock('ssl-validator', () => ({}));

export default class TestUtils {
    public static mockDateString = '2019-01-01 01:01:01';
    public static mockLogger = {} as BaseLogger;
    public static mockBaseConfig = {} as BaseConfig;

    public static getMockDate(): Date {
        return new Date(TestUtils.mockDateString);
    }

    public static beforeEachPrepareContainerAndDate(): void {
        MockDate.set(TestUtils.mockDateString);
        container.snapshot();
        container.rebind(TYPES.BackendLogger).toConstantValue(TestUtils.mockLogger);
        container.rebind(TYPES.BackendConfig).toConstantValue(TestUtils.mockBaseConfig);
        TestUtils.mockBaseConfig.isDevelopment = jest.fn().mockReturnValue(true);
    }

    public static afterEachRestoreContainerMocksAndDate(): void {
        MockDate.reset();
        container.restore();
        jest.clearAllMocks();
    }

    public static createApolloServerForIntegration(): ApolloServer {
        TestUtils.mockLogger.gql = jest.fn(() => Promise.resolve());

        // create a test server to test against, using our production typeDefs,
        // resolvers, and dataSources.
        const typeDefs = container.get<TypeDefRegister>(TYPES.TypeDefRegister).getTypeDefs();
        const resolvers = container.get<ResolverRegister>(TYPES.ResolverRegister).getResolvers();

        return new ApolloServer({
            typeDefs,
            schemaDirectives: {
                auth: AuthDirective,
            },
            resolvers,
            context: () => ({ user: { id: 1, email: 'a@a.a' } }),
        });
    }

    private static addModelFields<M extends Model>(m: M, id: string): M {
        m['_id'] = new ObjectID(id);
        m['_persisting_id'] = 'pId';
        m['_created_at'] = new Date('2020-12-17T03:24:00');
        m['_updated_at'] = new Date('2020-12-20T05:24:00');
        return m;
    }

    public static buildMockUser(id = '5edf4c48e9615d9a1c66baaa'): User {
        const m = new User('FirstName', 'LastName', 'password', 'test@mail.com', 'apiToken', []);
        return TestUtils.addModelFields<User>(m, id);
    }

    public static buildMockOrg(id = '5edf4c48e9615d9a1c66bbbb'): Org {
        const m = new Org(TestUtils.buildMockUser(), 'testOrg');
        return TestUtils.addModelFields<Org>(m, id);
    }

    public static buildMockAudit(mockEntity: any, id = '5edf4c48e9615d9a1c66bccc'): Audit {
        const m = new Audit(
            'SYSTEM',
            OperationOwner.SYSTEM,
            mockEntity,
            AuditAction.Create,
            GQLMethod.INDIRECT_METHOD,
            'comment',
            [mockEntity],
        );
        return TestUtils.addModelFields<Audit>(m, id);
    }

    public static buildMockInvite(id = '5edf4c48e9615d9a1c66bddd'): Invite {
        const m = new Invite('test@mail.com', TestUtils.buildMockOrg().id);
        return TestUtils.addModelFields<Invite>(m, id);
    }

    public static buildMockNotification(id = '5edf4c48e9615d9a1c66beee'): UserNotification {
        const m = new UserNotification(TestUtils.buildMockUser(), NotificationType.WELCOME);
        return TestUtils.addModelFields<UserNotification>(m, id);
    }

    public static buildDataManagerAccount(id = '5edf4c48e9615d9a1c66bfff'): DataManagerAccount {
        const m = new DataManagerAccount(TestUtils.buildMockOrg(), AccountType.USER, true);
        return TestUtils.addModelFields<DataManagerAccount>(m, id);
    }

    public static buildIngestEndpoint(id = '5edf4c48e9615d9a1c66babb'): IngestEndpoint {
        const m = new IngestEndpoint(
            'test ingest endpoint',
            TestUtils.buildDataManagerAccount(),
            true,
            StorageProvider.MONGODB,
        );
        return TestUtils.addModelFields<IngestEndpoint>(m, id);
    }

    public static buildIngestEndpointRevision(
        id = '5edf4c48e9615d9a1c66bacc',
    ): IngestEndpointRevision {
        const m = new IngestEndpointRevision(
            'test ingest endpoint revision',
            TestUtils.buildIngestEndpoint(),
        );
        return TestUtils.addModelFields<IngestEndpointRevision>(m, id);
    }

    public static buildIngestEndpointDataMap(
        id = '5edf4c48e9615d9a1c66badd',
    ): IngestEndpointDataMap {
        const m = new IngestEndpointDataMap(
            'DataMapKey',
            TestUtils.buildIngestEndpointRevision(),
            VarType.STRING,
        );
        return TestUtils.addModelFields<IngestEndpointDataMap>(m, id);
    }

    public static buildTagManagerAccount(id = '5edf4c48e9615d9a1c66baee'): TagManagerAccount {
        const m = new TagManagerAccount(TestUtils.buildMockOrg(), true);
        return TestUtils.addModelFields<TagManagerAccount>(m, id);
    }

    public static buildIngestEndpointEnvironment(
        id = '5edf4c48e9615d9a1c66baff',
    ): IngestEndpointEnvironment {
        const m = new IngestEndpointEnvironment(
            'test environment',
            TestUtils.buildIngestEndpoint(),
            StorageProvider.MONGODB,
            'test config',
            TestUtils.buildIngestEndpointRevision(),
        );
        return TestUtils.addModelFields<IngestEndpointEnvironment>(m, id);
    }

    public static buildMockApp(id = '5edf4c48e9615d9a1c66bbaa'): App {
        const m = new App(
            'test app',
            TestUtils.buildTagManagerAccount(),
            'testdomain.com',
            StorageProvider.MONGODB,
        );
        return TestUtils.addModelFields<App>(m, id);
    }

    public static buildMockRevision(id = '5edf4c48e9615d9a1c66bbbb'): Revision {
        const m = new Revision('test revision', TestUtils.buildMockApp());
        return TestUtils.addModelFields<Revision>(m, id);
    }

    public static buildMockTrigger(id = '5edf4c48e9615d9a1c66bbcc'): Trigger {
        const m = new Trigger(
            'test trigger',
            RevisionEntityParentType.REVISION,
            TestUtils.buildMockRevision(),
        );
        return TestUtils.addModelFields<Trigger>(m, id);
    }

    public static buildMockTag(id = '5edf4c48e9615d9a1c66bbdd'): Tag {
        const m = new Tag('test tag', TagType.HEAD, 0, 0, TestUtils.buildMockRevision(), true);
        return TestUtils.addModelFields<Tag>(m, id);
    }

    public static buildMockRule(id = '5edf4c48e9615d9a1c66bbee'): Rule {
        const m = new Rule(
            'test rule',
            TestUtils.buildMockRevision(),
            TestUtils.buildMockTrigger(),
        );
        return TestUtils.addModelFields<Rule>(m, id);
    }

    public static buildMockRuleGroup(id = '5edf4c48e9615d9a1c66bbff'): RuleGroup {
        const m = new RuleGroup('test rule group', TestUtils.buildMockRevision());
        return TestUtils.addModelFields<RuleGroup>(m, id);
    }

    public static buildMockPlatform(id = '5edf4c48e9615d9a1c66caaa'): Platform {
        const m = new Platform(
            PlatformType.CUSTOM,
            'test platform',
            'platform description',
            TestUtils.buildTagManagerAccount(),
        );
        return TestUtils.addModelFields<Platform>(m, id);
    }

    public static buildMockPlatformRevision(id = '5edf4c48e9615d9a1c66cbbb'): PlatformRevision {
        const m = new PlatformRevision('test platform revision', TestUtils.buildMockPlatform());
        return TestUtils.addModelFields<PlatformRevision>(m, id);
    }

    public static buildMockDataMap(id = '5edf4c48e9615d9a1c66cccc'): DataMap {
        const m = new DataMap('tdm', VarType.STRING, TestUtils.buildMockRevision(), 'value 1');
        return TestUtils.addModelFields<DataMap>(m, id);
    }

    public static buildMockPlatformDataMap(id = '5edf4c48e9615d9a1c66cdd0'): PlatformDataMap {
        const m = new PlatformDataMap(
            'pdm',
            'platform data map description',
            TestUtils.buildMockPlatformRevision(),
            VarType.STRING,
            InputType.TEXT,
        );
        return TestUtils.addModelFields<PlatformDataMap>(m, id);
    }

    public static buildMockPlatformEvent(id = '5edf4c48e9615d9a1c66cddd'): PlatformEvent {
        const m = new PlatformEvent(
            'test platform event',
            TestUtils.buildMockPlatformRevision(),
            'platform event description',
            'event',
            [TestUtils.buildMockPlatformDataMap()],
        );
        return TestUtils.addModelFields<PlatformEvent>(m, id);
    }

    public static buildMockEvent(id = '5edf4c48e9615d9a1c66ceee'): Event {
        const m = new Event(
            TestUtils.buildMockRevision(),
            TestUtils.buildMockPlatformEvent(),
            'test event',
            [TestUtils.buildMockDataMap()],
        );
        return TestUtils.addModelFields<Event>(m, id);
    }

    public static buildMockEnvironment(id = '5edf4c48e9615d9a1c66cfff'): Environment {
        const m = new Environment(
            'test environment',
            TestUtils.buildMockApp(),
            TestUtils.buildMockRevision(),
        );
        return TestUtils.addModelFields<Environment>(m, id);
    }

    public static buildMockPlatformDataContainer(
        id = '5edf4c48e9615d9a1c66cabb',
    ): PlatformDataContainer {
        const m = new PlatformDataContainer(
            'test platform data container',
            'test data container description',
            TestUtils.buildMockPlatformRevision(),
            [],
            true,
        );
        return TestUtils.addModelFields<PlatformDataContainer>(m, id);
    }

    public static buildMockConditionRule(id = '5edf4c48e9615d9a1c66cacc'): ConditionRule {
        const m = new ConditionRule(
            'test condition',
            TestUtils.buildMockRevision(),
            TestUtils.buildMockPlatformDataContainer(),
            'test match',
            ConditionType.EQUAL,
            'match value',
        );
        return TestUtils.addModelFields<ConditionRule>(m, id);
    }

    public static buildMockAppPlatformRevision(
        id = '5edf4c48e9615d9a1c66cadd',
    ): AppPlatformRevision {
        const m = new AppPlatformRevision(
            TestUtils.buildMockRevision(),
            TestUtils.buildMockPlatformRevision(),
        );
        return TestUtils.addModelFields<AppPlatformRevision>(m, id);
    }

    public static buildMockPlatformAction(id = '5edf4c48e9615d9a1c66caee'): PlatformAction {
        const m = new PlatformAction(
            'test platform action',
            TestUtils.buildMockPlatformRevision(),
            'platform action description',
        );
        return TestUtils.addModelFields<PlatformAction>(m, id);
    }

    public static buildMockPlatformActionPermission(
        id = '5edf4c48e9615d9a1c66caef',
    ): PlatformActionPermission {
        const m = new PlatformActionPermission(
            PlatformActionPermissionRequest.LOG_TO_CONSOLE,
            TestUtils.buildMockPlatformRevision(),
        );
        return TestUtils.addModelFields<PlatformActionPermission>(m, id);
    }

    public static buildMockAction(id = '5edf4c48e9615d9a1c66cbaa'): Action {
        const m = new Action(
            'test action',
            TestUtils.buildMockRevision(),
            TestUtils.buildMockPlatformAction(),
        );
        return TestUtils.addModelFields<Action>(m, id);
    }

    public static buildMockActionGroup(id = '5edf4c48e9615d9a1c66cbcc'): ActionGroup {
        const m = new ActionGroup('test action group', TestUtils.buildMockRevision());
        return TestUtils.addModelFields<ActionGroup>(m, id);
    }

    public static buildMockActionGroupDistribution(
        id = '5edf4c48e9615d9a1c66cbdd',
    ): ActionGroupDistribution {
        const m = new ActionGroupDistribution(
            'test action group distribution',
            RevisionEntityParentType.REVISION,
            TestUtils.buildMockRevision(),
        );
        return TestUtils.addModelFields<ActionGroupDistribution>(m, id);
    }

    public static buildMockPlatformAsset(id = '5edf4c48e9615d9a1c660ccc'): PlatformAsset {
        const m = new PlatformAsset(
            'test platform asset',
            TestUtils.buildMockPlatformRevision(),
            'some/type',
            200,
        );
        return TestUtils.addModelFields<PlatformAsset>(m, id);
    }
}
