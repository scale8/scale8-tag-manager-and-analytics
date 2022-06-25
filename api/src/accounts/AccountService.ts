import { inject, injectable } from 'inversify';
import TagManagerAccount from '../mongo/models/tag/TagManagerAccount';
import DataManagerAccount from '../mongo/models/data/DataManagerAccount';
import TYPES from '../container/IOC.types';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import GenericError from '../errors/GenericError';
import { LogPriority } from '../enums/LogPriority';
import userMessages from '../errors/UserMessages';
import Org from '../mongo/models/Org';
import User from '../mongo/models/User';
import GQLError from '../errors/GQLError';
import { AccountType } from '../enums/AccountType';
import GQLMethod from '../enums/GQLMethod';
import StripeService from '../payments/providers/StripeService';
import Stripe from 'stripe';
import { AccountProduct } from '../enums/AccountProduct';
import TagManagerAccountRepo from '../mongo/repos/tag/TagManagerAccountRepo';
import DataManagerAccountRepo from '../mongo/repos/data/DataManagerAccountRepo';

@injectable()
export default class AccountService {
    @inject(TYPES.RepoFromModelFactory) protected repoFactory!: RepoFromModelFactory;
    @inject(TYPES.StripeService) protected readonly stripeService!: StripeService;

    public async alignAccountWithSubscription(
        stripeProductId: string | undefined,
        account: TagManagerAccount | DataManagerAccount,
    ): Promise<void> {
        // ensure the account is in the right state
        if (
            (!account.enabled || account.isOnFreeTrial() || account.trialExpired()) &&
            stripeProductId !== undefined
        ) {
            const accountRepo = this.repoFactory(AccountService.accountToAccountTypeName(account));
            account.enabled = true;
            account.cancelTrial();

            await accountRepo.save(account, 'SYSTEM');
        }
    }

    public static accountToAccountTypeName(
        account: TagManagerAccount | DataManagerAccount,
    ): 'TagManagerAccount' | 'DataManagerAccount' {
        if (account.constructor.name === 'TagManagerAccount') {
            return 'TagManagerAccount';
        } else if (account.constructor.name === 'DataManagerAccount') {
            return 'DataManagerAccount';
        } else {
            throw new GenericError(
                `Account type ${account.constructor.name} has not been implemented yet`,
                LogPriority.ERROR,
                userMessages.accountFailed,
            );
        }
    }

    public async getAccountByProduct(
        org: Org,
        product: AccountProduct,
    ): Promise<DataManagerAccount | TagManagerAccount> {
        if (product === AccountProduct.TAG_MANAGER)
            return await this.repoFactory<TagManagerAccountRepo>(TagManagerAccount).getFromOrg(org);
        if (product === AccountProduct.DATA_MANAGER) {
            return await this.repoFactory<DataManagerAccountRepo>(DataManagerAccount).getFromOrg(
                org,
            );
        }
        throw new GenericError(
            `Account for product ${product} not implemented.`,
            LogPriority.ERROR,
        );
    }

    //validate product id exists...
    private getProductIdFromUserInput(productId: string): string {
        const productData = this.stripeService
            .getAccountConfigFromProductId(productId)
            .plans.find((_) => (_.id = productId));
        if (productData === undefined) {
            throw new GQLError(userMessages.productNotFound(productId), true);
        } else {
            return productData.id;
        }
    }

    public async subscribeToAccount(
        org: Org,
        account: TagManagerAccount | DataManagerAccount,
        productId: string,
        successUrl: string,
        cancelUrl: string,
    ): Promise<string | null> {
        const stripeSubscriptionId = await this.stripeService.getStripeSubscriptionId(org);
        const newStripeProductId = this.getProductIdFromUserInput(productId);

        const generateSubscriptionLink = async () => {
            //ok, generate new link for creating a subscription...
            return (
                await this.stripeService.createCheckoutSession(
                    org,
                    newStripeProductId,
                    successUrl,
                    cancelUrl,
                )
            ).id;
        };

        if (stripeSubscriptionId === undefined) {
            return await generateSubscriptionLink();
        } else {
            const currentStripeProductId = await this.stripeService.getStripeProductId(
                org,
                account,
            );

            if (currentStripeProductId === undefined) {
                //we must be upgrading from a free trial, but there is an existing subscription to join to...
                await this.stripeService.createProductLineItemOnSubscription(
                    stripeSubscriptionId,
                    newStripeProductId,
                );
            } else {
                //check products are different before trying to re-bill...
                if (currentStripeProductId !== newStripeProductId) {
                    await this.stripeService.updateProductLineItemOnSubscription(
                        stripeSubscriptionId,
                        currentStripeProductId,
                        newStripeProductId,
                    );
                }
            }
        }

        return null;
    }

    public async unsubscribeAccount(
        org: Org,
        account: TagManagerAccount | DataManagerAccount,
    ): Promise<boolean> {
        if (org.manualInvoicing) {
            await this.deleteAccount(org, account);
            return true;
        } else {
            const stripeSubscription = await this.stripeService.getStripeSubscription(org);
            const stripeProductId = await this.stripeService.getStripeProductId(org, account);
            if (stripeSubscription === undefined) {
                throw new GQLError(userMessages.noSubscription, true);
            } else if (stripeSubscription.status === 'active') {
                if (stripeProductId === undefined) {
                    throw new GQLError(userMessages.noProduct, true);
                } else {
                    await this.stripeService.cancelProductLineItemOnSubscription(
                        org,
                        stripeProductId,
                    );
                    await this.deleteAccount(org, account);
                    return true;
                }
            } else {
                throw new GQLError(userMessages.accountNotActive, true);
            }
        }
    }

    public async switchToManualInvoicing(org: Org, me: User): Promise<void> {
        const stripeSubscription = await this.stripeService.getStripeSubscription(org);

        await this.switchAccountToManualInvoicing(
            org,
            await this.getAccountByProduct(org, AccountProduct.TAG_MANAGER),
            stripeSubscription,
            me,
        );

        await this.switchAccountToManualInvoicing(
            org,
            await this.getAccountByProduct(org, AccountProduct.DATA_MANAGER),
            stripeSubscription,
            me,
        );

        org.manualInvoicing = true;
        await this.repoFactory(Org).save(org, me);
    }

    private async switchAccountToManualInvoicing(
        org: Org,
        account: TagManagerAccount | DataManagerAccount,
        stripeSubscription: Stripe.Subscription | undefined,
        me: User,
    ): Promise<void> {
        if (stripeSubscription !== undefined && stripeSubscription.status === 'active') {
            const stripeProductId = await this.stripeService.getStripeProductId(org, account);
            if (stripeProductId !== undefined) {
                await this.stripeService.cancelProductLineItemOnSubscription(org, stripeProductId);
            }
        }
        account.enabled = true;
        account.cancelTrial();
        await this.repoFactory(account.constructor.name).save(account, me);
    }

    private async deleteAccount(
        org: Org,
        account: TagManagerAccount | DataManagerAccount,
    ): Promise<void> {
        const accountType = account.constructor.name;
        const accountRepository = this.repoFactory(accountType);

        await accountRepository.delete(account, 'SYSTEM');
        // generate a new inactive account
        // todo... this is bad.... FIX IT. Data manager is breaking here for obvious reasons.
        const buildNewAccount = () => {
            if (accountType === 'TagManagerAccount') {
                return new TagManagerAccount(org, org.manualInvoicing);
            } else if (accountType === 'DataManagerAccount') {
                return new DataManagerAccount(org, AccountType.USER, org.manualInvoicing);
            } else {
                throw new GenericError(
                    `Account type ${accountType} has not been implemented yet`,
                    LogPriority.ERROR,
                );
            }
        };

        await accountRepository.save(buildNewAccount(), 'SYSTEM', {
            gqlMethod: GQLMethod.CREATE,
        });
    }
}
