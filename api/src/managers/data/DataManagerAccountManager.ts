import { inject, injectable } from 'inversify';
import Manager from '../../abstractions/Manager';
import { gql } from 'apollo-server-express';
import CTX from '../../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import DataManagerAccount from '../../mongo/models/data/DataManagerAccount';
import IngestEndpoint from '../../mongo/models/data/IngestEndpoint';
import { differenceInDays } from 'date-fns';
import userMessages from '../../errors/UserMessages';
import { fetchOrg } from '../../utils/OrgUtils';
import { usageFromAccount } from '../../utils/UsageUtils';
import DataManagerAccountRepo from '../../mongo/repos/data/DataManagerAccountRepo';
import TYPES from '../../container/IOC.types';
import AccountService from '../../accounts/AccountService';
import StripeService from '../../payments/providers/StripeService';

@injectable()
export default class DataManagerAccountManager extends Manager<DataManagerAccount> {
    @inject(TYPES.StripeService) protected readonly stripeService!: StripeService;
    @inject(TYPES.AccountService) protected readonly accountService!: AccountService;

    protected gqlSchema = gql`
        """
        @model
        Metrics to describe the \`Usage\` of a Data Manager account.
        """
        type DataManagerAccountUsage {
            day: DateTime!
            requests: Float!
            bytes: Float!
        }

        """
        @model
        The Data Manager Account is linked to directly to an organisation. It holds the plan type (account_type) and all the ingest endpoints linked to this Org.
        """
        type DataManagerAccount {
            """
            \`DataManagerAccount\` ID
            """
            id: ID!
            """
            \`Org\` that owns this \`DataManagerAccount\`
            """
            org: Org!
            """
            A list of \`IngestEndpoint\`s linked to the \`DataManagerAccount\`
            """
            ingest_endpoints: [IngestEndpoint!]!
            """
            Date the \`DataManagerAccount\` was created
            """
            created_at: DateTime!
            """
            Date the \`DataManagerAccount\` was last updated
            """
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
            Account usage
            """
            usage: [DataManagerAccountUsage!]!
            """
            Billing Cycle Requests
            """
            billing_cycle_requests: Float!
            """
            Billing Cycle Bytes
            """
            billing_cycle_bytes: Float!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=DataManagerAccount
            Returns a \`DataManagerAccount\` instance provided a valid ID is given and the user has sufficient privileges to view it.
            """
            getDataManagerAccount(id: ID!): DataManagerAccount!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getDataManagerAccount: async (parent: any, args: any, ctx: CTX) => {
            const dataManagerAccount = await this.repoFactory(DataManagerAccount).findByIdThrows(
                new ObjectId(args.id),
                userMessages.accountFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(
                ctx,
                dataManagerAccount.orgId,
                async () => dataManagerAccount.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        DataManagerAccount: {
            org: async (parent: any, args: any, ctx: CTX) => {
                const orgId = new ObjectId(parent.org_id);
                return await this.orgAuth.asUserWithViewAccess(ctx, orgId, async () => {
                    return (await fetchOrg(orgId)).toGQLType();
                });
            },
            ingest_endpoints: async (parent: any, args: any, ctx: CTX) => {
                const dataManagerAccount = await this.repoFactory(
                    DataManagerAccount,
                ).findByIdThrows(new ObjectId(parent.id), userMessages.accountFailed);
                return await this.orgAuth.asUserWithViewAccess(
                    ctx,
                    dataManagerAccount.orgId,
                    async () =>
                        (
                            await this.repoFactory(IngestEndpoint).find({
                                _data_manager_account_id: dataManagerAccount.id,
                            })
                        ).map((_) => _.toGQLType()),
                );
            },
            trial_expires_in: async (parent: any, args: any, ctx: CTX) => {
                const account = await this.repoFactory(DataManagerAccount).findByIdThrows(
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
                const account = await this.repoFactory(DataManagerAccount).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.accountFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, account.orgId, () => {
                    return account.isOnFreeTrial();
                });
            },
            trial_expired: async (parent: any, args: any, ctx: CTX) => {
                const account = await this.repoFactory(DataManagerAccount).findByIdThrows(
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
                    const account = await this.repoFactory<DataManagerAccountRepo>(
                        DataManagerAccount,
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
            usage: async (parent: any, args: any, ctx: CTX) => {
                const account = await this.repoFactory(DataManagerAccount).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.accountFailed,
                );
                return await usageFromAccount(account, ctx);
            },
            billing_cycle_requests: async (parent: any, args: any, ctx: CTX) => {
                // TODO: Chris must implement the logic as part of the billing PR
                return 0;
            },
            billing_cycle_bytes: async (parent: any, args: any, ctx: CTX) => {
                // TODO: Chris must implement the logic as part of the billing PR
                return 0;
            },
        },
    };
}
