import TestUtils from './TestUtils';
import ModelFromRepoFactory from '../../src/container/factoryTypes/ModelFromRepoFactory';
import RepoFromManagerFactory from '../../src/container/factoryTypes/RepoFromManagerFactory';
import RepoFromModelFactory from '../../src/container/factoryTypes/RepoFromModelFactory';
import RepoFromRepoNameFactory from '../../src/container/factoryTypes/RepoFromRepoNameFactory';
import container from '../../src/container/IOC.config';
import TYPES from '../../src/container/IOC.types';
import Shell from '../../src/mongo/database/Shell';
import UserAuth from '../../src/auth/UserAuth';
import OrgAuth from '../../src/auth/OrgAuth';
import CTX from '../../src/gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import User from '../../src/mongo/models/User';
import PlatformRevision from '../../src/mongo/models/tag/PlatformRevision';
import Platform from '../../src/mongo/models/tag/Platform';

export default class ManagerTestUtils {
    public static mockModelFromRepoFactory: ModelFromRepoFactory = jest.fn();
    public static mockRepoFromManagerFactory: RepoFromManagerFactory = jest.fn();
    public static mockRepoFromModelFactory: RepoFromModelFactory = jest.fn();
    public static mockRepoFromRepoNameFactory: RepoFromRepoNameFactory = jest.fn();
    public static mockUserAuth = {} as UserAuth;
    public static mockOrgAuth = {} as OrgAuth;
    public static mockShell = {} as Shell;

    public static beforeEachPrepareContainer(): void {
        TestUtils.beforeEachPrepareContainerAndDate();

        container
            .rebind(TYPES.ModelFromRepoFactory)
            .toConstantValue(ManagerTestUtils.mockModelFromRepoFactory);
        container
            .rebind(TYPES.RepoFromManagerFactory)
            .toConstantValue(ManagerTestUtils.mockRepoFromManagerFactory);
        container
            .rebind(TYPES.RepoFromModelFactory)
            .toConstantValue(ManagerTestUtils.mockRepoFromModelFactory);
        container
            .rebind(TYPES.RepoFromRepoNameFactory)
            .toConstantValue(ManagerTestUtils.mockRepoFromRepoNameFactory);
        container.rebind(TYPES.Shell).toConstantValue(ManagerTestUtils.mockShell);
        container.rebind(TYPES.UserAuth).toConstantValue(ManagerTestUtils.mockUserAuth);
        container.rebind(TYPES.OrgAuth).toConstantValue(ManagerTestUtils.mockOrgAuth);
    }

    public static mockOrgUserWithViewAccess(): void {
        const mockOrgAuth = container.get<OrgAuth>(TYPES.OrgAuth);
        mockOrgAuth.asUserWithViewAccess = jest.fn(
            async <U>(ctx: CTX, orgId: ObjectId, doThisWith: (user: User) => U) => {
                return doThisWith({} as User);
            },
        );
    }

    public static mockOrgUserWithViewAccessOnPlatform(): void {
        const mockOrgAuth = container.get<OrgAuth>(TYPES.OrgAuth);
        mockOrgAuth.asUserWithViewAccessOnPlatform = jest.fn(
            async <U>(ctx: CTX, platform: Platform, doThisWith: (user: User) => U) => {
                return doThisWith({} as User);
            },
        );
    }

    public static mockOrgUserWithViewAccessOnPlatformRevision(): void {
        const mockOrgAuth = container.get<OrgAuth>(TYPES.OrgAuth);
        mockOrgAuth.asUserWithViewAccessOnPlatformRevision = jest.fn(
            async <U>(
                ctx: CTX,
                platformRevision: PlatformRevision,
                doThisWith: (user: User) => U,
            ) => {
                return doThisWith({} as User);
            },
        );
    }

    public static mockAsLoggedUser(): void {
        const mockUserAuth = container.get<UserAuth>(TYPES.UserAuth);
        mockUserAuth.asUser = jest.fn(<U>(ctx: CTX, doThisWith: (user: User) => U): U => {
            return doThisWith(TestUtils.buildMockUser());
        });
    }
}
