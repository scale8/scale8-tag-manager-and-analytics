import { inject, injectable } from 'inversify';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Org from '../../mongo/models/Org';
import TYPES from '../../container/IOC.types';
import RepoFromModelFactory from '../../container/factoryTypes/RepoFromModelFactory';
import User from '../../mongo/models/User';
import GenericError from '../../errors/GenericError';
import TagManagerAccount from '../../mongo/models/tag/TagManagerAccount';
import DataManagerAccount from '../../mongo/models/data/DataManagerAccount';
import userMessages from '../../errors/UserMessages';
import { LogPriority } from '../../enums/LogPriority';
import BaseLogger from '../../backends/logging/abstractions/BaseLogger';
import BaseConfig from '../../backends/configuration/abstractions/BaseConfig';
import StripeProducts from './StripeProducts';
import AccountService from '../../accounts/AccountService';

dotenv.config();

@injectable()
export default class StripeService {
    @inject(TYPES.RepoFromModelFactory) private readonly repoFactory!: RepoFromModelFactory;
    @inject(TYPES.BackendLogger) private readonly logger!: BaseLogger;
    @inject(TYPES.BackendConfig) private readonly config!: BaseConfig;

    private stripe: Stripe | undefined;

    public async getStripe(): Promise<Stripe> {
        if (this.config.isNotCommercial()) {
            throw new GenericError(userMessages.billingUnavailable, LogPriority.DEBUG, true);
        }
        if (this.stripe === undefined) {
            this.stripe = new Stripe(await this.config.getStripeSecretKey(), {
                apiVersion: '2020-08-27',
            });
        }
        return this.stripe;
    }

    public getAccountTypeFromProductId(
        productId: string,
    ): 'TagManagerAccount' | 'DataManagerAccount' {
        if (
            StripeProducts.getTagManagerProductConfig().plans.find((_) => _.id === productId) !==
            undefined
        ) {
            return 'TagManagerAccount';
        } else if (
            StripeProducts.getDataManagerProductConfig().plans.find((_) => _.id === productId) !==
            undefined
        ) {
            return 'DataManagerAccount';
        } else {
            throw new GenericError(
                `Failed to resolve product id ${productId} to an account type`,
                LogPriority.DEBUG,
                userMessages.paymentProviderIssue,
            );
        }
    }

    public getAccountConfigFromProductId(productId: string): {
        plans: {
            id: string;
            name: string;
            amount: number;
        }[];
    } {
        const accountType = this.getAccountTypeFromProductId(productId);
        if (accountType === 'TagManagerAccount') {
            return StripeProducts.getTagManagerProductConfig();
        } else if (accountType === 'DataManagerAccount') {
            return StripeProducts.getDataManagerProductConfig();
        } else {
            throw new GenericError(
                `Account type ${accountType} has not been implemented yet`,
                LogPriority.ERROR,
            );
        }
    }

    public async getPricesForProduct(productId: string): Promise<Stripe.Price[]> {
        return (
            await (
                await this.getStripe()
            ).prices.list({
                product: productId,
            })
        ).data;
    }

    /*
        We may have month + year billing at some point, this is where we'll need to identify which price with a flag
     */
    public async getPriceFromProductId(productId: string): Promise<Stripe.Price> {
        const prices = await this.getPricesForProduct(productId);
        if (prices.length > 0) {
            return prices[0];
        } else {
            throw new GenericError(
                'Unable to find default price for product',
                LogPriority.DEBUG,
                userMessages.paymentProviderIssue,
            );
        }
    }

    public async createCustomerOnOrg(org: Org): Promise<Org> {
        if (org.stripeCustomerId !== undefined) {
            return org;
        } else {
            const billingUser = await this.repoFactory(User).findByIdThrows(
                org.orgOwnerUser,
                userMessages.missingOwner,
            );
            const getCustomer = async () => {
                return await (
                    await this.getStripe()
                ).customers.create({
                    name: org.name,
                    email: billingUser.email,
                    metadata: {
                        org_id: org.id.toString(),
                        env: this.config.getEnvironment(),
                    },
                });
            };
            const customer = await getCustomer();
            org.stripeCustomerId = customer.id;
            return await this.repoFactory(Org).save(org, 'SYSTEM');
        }
    }

    public async createProductLineItemOnSubscription(
        subscriptionId: string,
        productId: string,
    ): Promise<Stripe.Subscription> {
        return (await this.getStripe()).subscriptions.update(subscriptionId, {
            proration_behavior: 'create_prorations',
            billing_cycle_anchor: 'now',
            items: [
                {
                    price: (await this.getPriceFromProductId(productId)).id,
                    quantity: 1,
                },
            ],
        });
    }

    public async updateProductLineItemOnSubscription(
        subscriptionId: string,
        oldProductId: string,
        newProductId: string,
    ): Promise<Stripe.Subscription> {
        const stripe = await this.getStripe();
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const oldLineItem = subscription.items.data.find((_) => _.price.product === oldProductId);
        if (oldLineItem === undefined) {
            throw new GenericError(
                'Unable to find line item on subscription for old product id',
                LogPriority.DEBUG,
                userMessages.paymentProviderIssue,
            );
        } else {
            return stripe.subscriptions.update(subscriptionId, {
                proration_behavior: 'create_prorations',
                billing_cycle_anchor: 'now',
                items: [
                    {
                        id: oldLineItem.id,
                        deleted: true,
                    },
                    {
                        price: (await this.getPriceFromProductId(newProductId)).id,
                        quantity: 1,
                    },
                ],
            });
        }
    }

    public async cancelProductLineItemOnSubscription(
        org: Org,
        productId: string,
    ): Promise<boolean> {
        const stripe = await this.getStripe();
        const stripeSubscriptionId = await this.getStripeSubscriptionId(org);
        if (stripeSubscriptionId === undefined) {
            return true;
        }
        const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        if (subscription.items.data.length > 1) {
            //just remove the line item...
            const oldLineItem = subscription.items.data.find((_) => _.price.product === productId);
            if (oldLineItem === undefined) {
                throw new GenericError(
                    'Unable to find line item to cancel on subscription for product id provided',
                    LogPriority.DEBUG,
                    userMessages.paymentProviderIssue,
                );
            } else {
                await stripe.subscriptions.update(stripeSubscriptionId, {
                    items: [
                        {
                            id: oldLineItem.id,
                            deleted: true,
                        },
                    ],
                });
                return true;
            }
        } else {
            //just cancel the whole subscription...
            return this.cancelSubscription(org);
        }
    }

    public async cancelSubscription(org: Org): Promise<boolean> {
        const stripe = await this.getStripe();
        const stripeSubscriptionId = await this.getStripeSubscriptionId(org);
        if (stripeSubscriptionId === undefined) {
            return true;
        }
        await stripe.subscriptions.del(stripeSubscriptionId);
        await this.removeOrgSubscriptionData(org);
        return true;
    }

    public async createCheckoutSession(
        org: Org,
        productId: string,
        successUrl: string,
        cancelUrl: string,
    ): Promise<Stripe.Checkout.Session> {
        const stripe = await this.getStripe();
        return await stripe.checkout.sessions.create({
            customer: org.stripeCustomerId,
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: (await this.getPriceFromProductId(productId)).id,
                    quantity: 1,
                },
            ],
            tax_id_collection: {
                enabled: true,
            },
            automatic_tax: {
                enabled: true,
            },
            customer_update: {
                address: 'auto',
                name: 'auto',
            },
            success_url: successUrl,
            cancel_url: cancelUrl,
        });
    }

    public async getBillingPortalUrl(org: Org, returnUrl: string): Promise<string> {
        const stripe = await this.getStripe();
        if (org.stripeCustomerId === undefined) {
            throw new GenericError(
                'No customer available to manage',
                LogPriority.DEBUG,
                userMessages.paymentProviderIssue,
            );
        }
        const session = await stripe.billingPortal.sessions.create({
            customer: org.stripeCustomerId,
            return_url: returnUrl,
        });
        return session.url;
    }

    public async getStripeSubscriptionId(org: Org): Promise<string | undefined> {
        if (this.config.isNotCommercial()) {
            return undefined;
        }
        if (org.stripeSubscriptionId !== undefined) {
            return org.stripeSubscriptionId;
        }
        const subscription = await this.getStripeSubscription(org);
        return subscription === undefined ? undefined : subscription.id;
    }

    public async getStripeSubscription(org: Org): Promise<Stripe.Subscription | undefined> {
        const stripe = await this.getStripe();
        if (org.stripeSubscriptionId !== undefined) {
            return await stripe.subscriptions.retrieve(org.stripeSubscriptionId);
        }
        if (org.stripeCustomerId === undefined) {
            return undefined;
        }
        const customer = (await stripe.customers.retrieve(org.stripeCustomerId, {
            expand: ['subscriptions'],
        })) as Stripe.Customer & {
            subscriptions: { data: { id: string }[] };
        };
        if (customer.subscriptions.data.length === 0) {
            return undefined;
        }
        return customer.subscriptions.data[0];
    }

    public async getStripeProductId(
        org: Org,
        account: TagManagerAccount | DataManagerAccount,
    ): Promise<string | undefined> {
        if (this.config.isNotCommercial()) {
            return undefined;
        }
        const stripe = await this.getStripe();
        const stripeSubscriptionId = await this.getStripeSubscriptionId(org);
        if (stripeSubscriptionId === undefined) {
            return undefined;
        }
        const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        if (subscription.items.data.length === 0) {
            return undefined;
        }
        const lineItem = subscription.items.data.find(
            (_) =>
                _.price.metadata.account_type === AccountService.accountToAccountTypeName(account),
        );
        return lineItem === undefined ? undefined : (lineItem.price.product as string);
    }

    public async updateOrgSubscriptionData(
        org: Org,
        stripeSubscription?: Stripe.Subscription,
    ): Promise<Org> {
        const subscription = stripeSubscription ?? (await this.getStripeSubscription(org));
        if (subscription === undefined) {
            return this.removeOrgSubscriptionData(org);
        } else {
            org.stripeSubscriptionId = subscription.id;
            org.billingStart = new Date(subscription.current_period_start * 1000);
            org.billingEnd = new Date(subscription.current_period_end * 1000);
            await this.repoFactory(Org).save(org, 'SYSTEM');
            return org;
        }
    }

    private async removeOrgSubscriptionData(org: Org): Promise<Org> {
        org.stripeSubscriptionId = undefined;
        org.billingStart = undefined;
        org.billingEnd = undefined;
        await this.repoFactory(Org).save(org, 'SYSTEM');
        return org;
    }
}
