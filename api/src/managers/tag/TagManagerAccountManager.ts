import TagManagerAccount from '../../mongo/models/tag/TagManagerAccount';
import { injectable } from 'inversify';
import Manager from '../../abstractions/Manager';
import { gql } from 'apollo-server-express';
import CTX from '../../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import App from '../../mongo/models/tag/App';
import Platform from '../../mongo/models/tag/Platform';
import { differenceInDays } from 'date-fns';
import userMessages from '../../errors/UserMessages';
import { fetchOrg } from '../../utils/OrgUtils';
import { usageFromAccount } from '../../utils/UsageUtils';

@injectable()
export default class TagManagerAccountManager extends Manager<TagManagerAccount> {
    protected gqlSchema = gql`
        """
        @model
        """
        type TagManagerAccountUsage {
            day: DateTime!
            requests: Int!
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
            Account Usage
            """
            usage: [TagManagerAccountUsage!]!
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
                        const daysRemaining = differenceInDays(account.trialExpiresOn, new Date());
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
                    return this.stripeService.getStripeProductId(org, 'TagManagerAccount');
                });
            },
            usage: async (parent: any, args: any, ctx: CTX) => {
                const account = await this.repoFactory(TagManagerAccount).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.accountFailed,
                );
                return await usageFromAccount(account, ctx);
            },
        },
    };
}
