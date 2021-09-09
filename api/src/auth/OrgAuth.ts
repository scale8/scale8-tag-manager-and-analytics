import CTX from '../gql/ctx/CTX';
import User from '../mongo/models/User';
import AuthenticationError from '../errors/AuthenticationError';
import { ObjectID } from 'mongodb';
import UserAuth from './UserAuth';
import { inject, injectable } from 'inversify';
import TYPES from '../container/IOC.types';
import OrgRole from '../mongo/models/OrgRole';
import OrgRoleRepo from '../mongo/repos/OrgRoleRepo';
import Platform from '../mongo/models/tag/Platform';
import PlatformRevision from '../mongo/models/tag/PlatformRevision';
import PlatformRepo from '../mongo/repos/tag/PlatformRepo';
import Org from '../mongo/models/Org';
import userMessages from '../errors/UserMessages';

@injectable()
export default class OrgAuth {
    @inject(TYPES.OrgRoleRepo) protected readonly orgRoleRepo!: OrgRoleRepo;
    @inject(TYPES.UserAuth) protected readonly userAuth!: UserAuth;
    @inject(TYPES.PlatformRepo) protected readonly platformRepo!: PlatformRepo;

    protected async getRole(user: User, orgId: ObjectID): Promise<OrgRole> {
        return this.orgRoleRepo.findOneThrows(
            {
                _user_id: user.id,
                _org_id: orgId,
            },
            undefined,
            undefined,
            undefined,
            new AuthenticationError(
                'Failed to link current user to this organisation. Please make sure your current user session is accessing the correct account',
                userMessages.noAccessOnOrg,
            ),
        );
    }

    public asUserWithOrgManagement<U>(ctx: CTX, doThisWith: (user: User) => U): U {
        return this.userAuth.asUser(ctx, (u) => {
            if (u.canManageOrgs) {
                return doThisWith(u);
            } else {
                throw new AuthenticationError(userMessages.noManageRightsOnOrgs, true);
            }
        });
    }

    public async asUserWithViewAccessOnPlatform<U>(
        ctx: CTX,
        platform: Platform,
        doThisWith: (user: User) => U,
    ): Promise<U> {
        return this.userAuth.asUser(ctx, async (u) => {
            if (platform.isPublic) {
                return doThisWith(u);
            } else {
                const role = await this.getRole(u, platform.orgId);
                if (role.permissionGroup.canView || role.permissionGroup.isAdmin) {
                    return doThisWith(u);
                } else {
                    throw new AuthenticationError(userMessages.noCreateRightsOnPlatform, true);
                }
            }
        });
    }

    public async asUserWithViewAccessOnPlatformRevision<U>(
        ctx: CTX,
        platformRevision: PlatformRevision,
        doThisWith: (user: User) => U,
    ): Promise<U> {
        return this.userAuth.asUser(ctx, async (u) => {
            const platform = await this.platformRepo.findByIdThrows(
                platformRevision.platformId,
                userMessages.platformFailed,
            );
            if (platform.isPublic && platformRevision.isPublished) {
                return doThisWith(u);
            } else {
                const role = await this.getRole(u, platformRevision.orgId);
                if (role.permissionGroup.canView || role.permissionGroup.isAdmin) {
                    return doThisWith(u);
                } else {
                    throw new AuthenticationError(
                        userMessages.noViewRightsOnPlatformRevision,
                        true,
                    );
                }
            }
        });
    }

    public async asUserWithOrgAdmin<U>(
        ctx: CTX,
        orgId: ObjectID,
        doThisWith: (user: User) => U,
    ): Promise<U> {
        return this.userAuth.asUser(ctx, async (u) => {
            const orgRole = await this.getRole(u, orgId);
            if (orgRole.permissionGroup.isAdmin) {
                return doThisWith(u);
            } else {
                throw new AuthenticationError(userMessages.noAdminAccessOnOrg, true);
            }
        });
    }

    public async asUserWithOrgOwnership<U>(
        ctx: CTX,
        org: Org,
        doThisWith: (user: User) => U,
    ): Promise<U> {
        return this.userAuth.asUser(ctx, async (u) => {
            if (org.orgOwnerUser.equals(u.id)) {
                return doThisWith(u);
            } else {
                throw new AuthenticationError(userMessages.noOwnershipRightsOnOrgs, true);
            }
        });
    }

    public async isUserWithViewAccess(ctx: CTX, orgId: ObjectID): Promise<boolean> {
        const orgRole = await this.orgRoleRepo.findOne({
            _user_id: ctx.user?.id,
            _org_id: orgId,
        });
        if (orgRole === null) {
            return false;
        } else {
            return orgRole.permissionGroup.canView || orgRole.permissionGroup.isAdmin;
        }
    }

    public async asUserWithViewAccess<U>(
        ctx: CTX,
        orgId: ObjectID,
        doThisWith: (user: User) => U,
    ): Promise<U> {
        return this.userAuth.asUser(ctx, async (u) => {
            const orgRole = await this.getRole(u, orgId);
            if (orgRole.permissionGroup.canView || orgRole.permissionGroup.isAdmin) {
                return doThisWith(u);
            } else {
                throw new AuthenticationError(userMessages.noAccessOnOrg, true);
            }
        });
    }

    public async asUserWithCreateAccess<U>(
        ctx: CTX,
        orgId: ObjectID,
        doThisWith: (user: User) => U,
    ): Promise<U> {
        return this.userAuth.asUser(ctx, async (u) => {
            const orgRole = await this.getRole(u, orgId);
            if (orgRole.permissionGroup.canCreate || orgRole.permissionGroup.isAdmin) {
                return doThisWith(u);
            } else {
                throw new AuthenticationError(userMessages.noCreateRightsOnOrg, true);
            }
        });
    }

    public async asUserWithEditAccess<U>(
        ctx: CTX,
        orgId: ObjectID,
        doThisWith: (user: User) => U,
    ): Promise<U> {
        return this.userAuth.asUser(ctx, async (u) => {
            const orgRole = await this.getRole(u, orgId);
            if (orgRole.permissionGroup.canEdit || orgRole.permissionGroup.isAdmin) {
                return doThisWith(u);
            } else {
                throw new AuthenticationError(userMessages.noCreateRightsOnOrg, true);
            }
        });
    }

    public async asUserWithDeleteAccess<U>(
        ctx: CTX,
        orgId: ObjectID,
        doThisWith: (user: User) => U,
    ): Promise<U> {
        return this.userAuth.asUser(ctx, async (u) => {
            const orgRole = await this.getRole(u, orgId);
            if (orgRole.permissionGroup.canDelete || orgRole.permissionGroup.isAdmin) {
                return doThisWith(u);
            } else {
                throw new AuthenticationError(userMessages.noCreateRightsOnOrg, true);
            }
        });
    }
}
