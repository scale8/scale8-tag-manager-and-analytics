import TagManagerAccount from '../../mongo/models/tag/TagManagerAccount';
import { inject, injectable } from 'inversify';
import Manager from '../../abstractions/Manager';
import { gql } from 'apollo-server-express';
import CTX from '../../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import App from '../../mongo/models/tag/App';
import Platform from '../../mongo/models/tag/Platform';
import { differenceInDays } from 'date-fns';
import userMessages from '../../errors/UserMessages';
import { fetchOrg } from '../../utils/OrgUtils';
import TagManagerAccountRepo from '../../mongo/repos/tag/TagManagerAccountRepo';
import TYPES from '../../container/IOC.types';
import AccountService from '../../accounts/AccountService';
import StripeService from '../../payments/providers/StripeService';
import { StorageProvider } from '../../enums/StorageProvider';
import BaseDatabase from '../../backends/databases/abstractions/BaseDatabase';

@injectable()
export default class TagManagerAccountManager extends Manager<TagManagerAccount> {
    @inject(TYPES.StripeService) protected readonly stripeService!: StripeService;
    @inject(TYPES.AccountService) protected readonly accountService!: AccountService;

    @inject(TYPES.BackendDatabaseFactory) private backendDatabaseFactory!: (
        storage_provider: StorageProvider,
    ) => BaseDatabase;

    protected gqlSchema = gql`
        """
        @model
        """
        type TagManagerAccountUsage {
            request_count: Float!
        }

        """
        @model
        """
        type TagManagerAccount {
            id: ID!
            org: Org!
            apps: [App!]!
            platforms: [Platform!]!
            created_at: DateTime!
            updated_at: DateTime!
            """
            The current product id associated with this account. If this is free plan or managed, this will not be provided
            """
            stripe_product_id: String
            """
            The amount of days until the trial expires
            """
            trial_expires_in: Int!
            """
            If the account is in a trial period
            """
            is_trial: Boolean!
            """
            If the free trial is expired
            """
            trial_expired: Boolean!
            """
            If the account is enabled
            """
            enabled: Boolean!
            """
            Current billing cycle usage
            """
            current_billing_cycle_usage: TagManagerAccountUsage!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=TagManagerAccount
            """
            getTagManagerAccount(id: ID!): TagManagerAccount!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getTagManagerAccount: async (parent: any, args: any, ctx: CTX) => {
            const tagManagerAccount = await this.repoFactory(TagManagerAccount).findByIdThrows(
                new ObjectId(args.id),
                userMessages.accountFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(ctx, tagManagerAccount.orgId, async () =>
                tagManagerAccount.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        TagManagerAccount: {
            org: async (parent: any, args: any, ctx: CTX) => {
                const orgId = new ObjectId(parent.org_id);
                return await this.orgAuth.asUserWithViewAccess(ctx, orgId, async () => {
                    return (await fetchOrg(orgId)).toGQLType();
                });
            },
            apps: async (parent: any, args: any, ctx: CTX) => {
                const tagManagerAccount = await this.repoFactory(TagManagerAccount).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.accountFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(
                    ctx,
                    tagManagerAccount.orgId,
                    async () =>
                        (
                            await this.repoFactory(App).find({
                                _tag_manager_account_id: tagManagerAccount.id,
                            })
                        ).map((_) => _.toGQLType()),
                );
            },
            platforms: async (parent: any, args: any, ctx: CTX) => {
                const tagManagerAccount = await this.repoFactory(TagManagerAccount).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.accountFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(
                    ctx,
                    tagManagerAccount.orgId,
                    async () =>
                        (
                            await this.repoFactory(Platform).find({
                                _tag_manager_account_id: tagManagerAccount.id,
                            })
                        ).map((_) => _.toGQLType()),
                );
            },
            trial_expires_in: async (parent: any, args: any, ctx: CTX) => {
                const account = await this.repoFactory(TagManagerAccount).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.accountFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, account.orgId, () => {
                    if (account.trialExpiresOn === undefined) {
                        return 0;
                    } else {
                        const daysRemaining =
                            differenceInDays(account.trialExpiresOn, new Date()) + 1;
                        return daysRemaining > 0 ? daysRemaining : 0;
                    }
                });
            },
            is_trial: async (parent: any, args: any, ctx: CTX) => {
                const account = await this.repoFactory(TagManagerAccount).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.accountFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, account.orgId, () => {
                    return account.isOnFreeTrial();
                });
            },
            trial_expired: async (parent: any, args: any, ctx: CTX) => {
                const account = await this.repoFactory(TagManagerAccount).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.accountFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, account.orgId, () => {
                    return account.trialExpired();
                });
            },
            stripe_product_id: async (parent: any, args: any, ctx: CTX) => {
                const org = await fetchOrg(new ObjectId(parent.org_id));

                return await this.orgAuth.asUserWithViewAccess(ctx, org.id, async () => {
                    const account = await this.repoFactory<TagManagerAccountRepo>(
                        TagManagerAccount,
                    ).getFromOrg(org);
                    const stripeProductId = await this.stripeService.getStripeProductId(
                        org,
                        account,
                    );
                    await this.accountService.alignAccountWithSubscription(
                        stripeProductId,
                        account,
                    );
                    return stripeProductId;
                });
            },
            current_billing_cycle_usage: async (parent: any, args: any, ctx: CTX) => {
                const orgId = new ObjectId(parent.org_id);
                const tagManagerAccountId = new ObjectId(parent.id);
                return await this.orgAuth.asUserWithViewAccess(ctx, orgId, async () => {
                    //we need to fetch all apps...
                    const org = await fetchOrg(orgId);
                    const apps = await this.repoFactory(App).find({
                        _tag_manager_account_id: tagManagerAccountId,
                    });
                    return {
                        request_count: (
                            await Promise.all(
                                apps.map(async (app) => {
                                    if (
                                        org.billingStart !== undefined &&
                                        org.billingEnd !== undefined
                                    ) {
                                        const appUsage = await this.backendDatabaseFactory(
                                            app.storageProvider,
                                        ).appBillingCycleUsage(
                                            app,
                                            org.billingStart,
                                            org.billingEnd,
                                        );
                                        return appUsage.result;
                                    } else {
                                        return 0;
                                    }
                                }),
                            )
                        ).reduce((a, b) => a + b, 0),
                    };
                });
            },
        },
    };
}
