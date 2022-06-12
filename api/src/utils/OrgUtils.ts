import Org from '../mongo/models/Org';
import { ObjectId } from 'mongodb';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import userMessages from '../errors/UserMessages';
import User from '../mongo/models/User';
import GQLMethod from '../enums/GQLMethod';
import TagManagerAccount from '../mongo/models/tag/TagManagerAccount';
import DataManagerAccount from '../mongo/models/data/DataManagerAccount';
import { AccountType } from '../enums/AccountType';
import PermissionGroup from '../mongo/models/PermissionGroup';
import StripeService from '../payments/providers/StripeService';
import UserRepo from '../mongo/repos/UserRepo';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import OrgRole from '../mongo/models/OrgRole';
import GenericError from '../errors/GenericError';
import { LogPriority } from '../enums/LogPriority';

export const fetchOrg = async (id: ObjectId): Promise<Org> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    return repoFactory(Org).findByIdThrows(id, userMessages.orgFailed);
};

export const findUserAvailableByEmail = async (
    email: string,
    orgId: ObjectId,
): Promise<User | null> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const user = await repoFactory(User).findOne({
        _email: email,
    });

    if (user !== null) {
        // User is already in the system
        const roles = await repoFactory(OrgRole).find({
            _org_id: orgId,
        });
        const matchingRole = roles.find((_) => _.userId.toString() === user.id.toString());
        if (matchingRole !== undefined) {
            throw new GenericError(userMessages.userAlreadyIncluded, LogPriority.DEBUG, true);
        }
        return user;
    }
    return null;
};

/**
 * Creates new organization...
 *
 * @param actor
 * @param name
 * @param adminUsers
 * @param orgId
 * @param comments
 * @param createTagManagerTrial
 * @param createDataManagerTrial
 * @param manualInvoicing
 */
export const createOrg = async (
    actor: User,
    name: string,
    adminUsers: User[],
    orgId?: ObjectId,
    comments?: string,
    createTagManagerTrial?: boolean,
    createDataManagerTrial?: boolean,
    manualInvoicing?: boolean,
): Promise<Org> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const config = container.get<BaseConfig>(TYPES.BackendConfig);
    const isTagManagerTrial = config.isCommercial() ? createTagManagerTrial : false;
    const isDataManagerTrial = config.isCommercial() ? createDataManagerTrial : false;
    const isManualInvoicing = config.isCommercial() ? manualInvoicing : true;

    let org = new Org(actor, name, undefined, isManualInvoicing);
    if (orgId !== undefined) {
        org['_id'] = orgId;
    }
    org = await repoFactory(Org).save(org, actor, {
        gqlMethod: GQLMethod.CREATE,
        userComments: comments,
        forceCreate: orgId !== undefined,
    });

    if (config.isCommercial()) {
        const stripeService = container.get<StripeService>(TYPES.StripeService);
        org = await stripeService.createCustomerOnOrg(org);
    }

    //create a tag manager account...
    await repoFactory(TagManagerAccount).save(
        new TagManagerAccount(
            org,
            isTagManagerTrial === true || isManualInvoicing === true,
            isTagManagerTrial,
        ),
        actor,
        {
            gqlMethod: GQLMethod.CREATE,
        },
    );

    //create a data manager account...
    await repoFactory(DataManagerAccount).save(
        new DataManagerAccount(
            org,
            AccountType.USER,
            isDataManagerTrial === true || isManualInvoicing === true,
            isDataManagerTrial,
        ),
        actor,
        {
            gqlMethod: GQLMethod.CREATE,
        },
    );

    //create the system data manager...
    //this needs to persist as it tracks usage... it should never be deleted. without this we can't bill.
    await repoFactory(DataManagerAccount).save(
        new DataManagerAccount(org, AccountType.SYSTEM, true),
        actor,
        {
            gqlMethod: GQLMethod.CREATE,
        },
    );

    //link admin users to org...
    await Promise.all(
        adminUsers.map((adminUser) =>
            repoFactory<UserRepo>(User).linkToOrg(
                actor,
                adminUser,
                org,
                new PermissionGroup(true, true, true, true, true),
            ),
        ),
    );
    return org;
};
