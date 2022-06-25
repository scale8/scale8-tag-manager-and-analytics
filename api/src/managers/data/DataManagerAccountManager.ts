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
import DataManagerAccountRepo from '../../mongo/repos/data/DataManagerAccountRepo';
import TYPES from '../../container/IOC.types';
import AccountService from '../../accounts/AccountService';
import StripeService from '../../payments/providers/StripeService';
import { StorageProvider } from '../../enums/StorageProvider';
import BaseDatabase from '../../backends/databases/abstractions/BaseDatabase';

@injectable()
export default class DataManagerAccountManager extends Manager<DataManagerAccount> {
    @inject(TYPES.StripeService) protected readonly stripeService!: StripeService;
    @inject(TYPES.AccountService) protected readonly accountService!: AccountService;

    @inject(TYPES.BackendDatabaseFactory) private backendDatabaseFactory!: (
        storage_provider: StorageProvider,
    ) => BaseDatabase;

    protected gqlSchema = gql`
        """
        @model
        """
        type DataManagerAccountUsage {
            request_count: Float!
            byte_count: Float!
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
            Current billing cycle usage
            """
            current_billing_cycle_usage: DataManagerAccountUsage!
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
            current_billing_cycle_usage: async (parent: any, args: any, ctx: CTX) => {
                const orgId = new ObjectId(parent.org_id);
                const dataManagerAccountId = new ObjectId(parent.id);
                return await this.orgAuth.asUserWithViewAccess(ctx, orgId, async () => {
                    //we need to fetch all apps...
                    const org = await fetchOrg(orgId);
                    const ingestEndpoints = await this.repoFactory(IngestEndpoint).find({
                        _data_manager_account_id: dataManagerAccountId,
                    });
                    return (
                        await Promise.all(
                            ingestEndpoints.map(async (ingestEndpoint) => {
                                if (
                                    org.billingStart !== undefined &&
                                    org.billingEnd !== undefined
                                ) {
                                    const ingestEndpointUsage = await this.backendDatabaseFactory(
                                        ingestEndpoint.storageProvider,
                                    ).ingestBillingCycleUsage(
                                        ingestEndpoint,
                                        org.billingStart,
                                        org.billingEnd,
                                    );
                                    return ingestEndpointUsage.result;
                                } else {
                                    return {
                                        request_count: 0,
                                        byte_count: 0,
                                    };
                                }
                            }),
                        )
                    ).reduce(
                        (a, b) => {
                            return {
                                request_count: a.request_count + b.request_count,
                                byte_count: a.byte_count + b.byte_count,
                            };
                        },
                        {
                            request_count: 0,
                            byte_count: 0,
                        },
                    );
                });
            },
        },
    };
}
