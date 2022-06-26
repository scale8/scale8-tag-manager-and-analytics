import { inject, injectable } from 'inversify';
import TYPES from '../container/IOC.types';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import StripeService from '../payments/providers/StripeService';
import Org from '../mongo/models/Org';
import User from '../mongo/models/User';
import { AccountProduct } from '../enums/AccountProduct';
import AccountService from '../accounts/AccountService';

@injectable()
export default class OrgService {
    @inject(TYPES.RepoFromModelFactory) protected repoFactory!: RepoFromModelFactory;
    @inject(TYPES.StripeService) protected readonly stripeService!: StripeService;
    @inject(TYPES.AccountService) protected readonly accountService!: AccountService;

    public async switchToManualInvoicing(org: Org, me: User): Promise<void> {
        const stripeSubscription = await this.stripeService.getStripeSubscription(org);

        await this.accountService.switchToManualInvoicing(
            org,
            await this.accountService.getAccountByProduct(org, AccountProduct.TAG_MANAGER),
            stripeSubscription,
            me,
        );

        await this.accountService.switchToManualInvoicing(
            org,
            await this.accountService.getAccountByProduct(org, AccountProduct.DATA_MANAGER),
            stripeSubscription,
            me,
        );

        org.manualInvoicing = true;
        await this.repoFactory(Org).save(org, me);
    }

    public async alignSubscription(org: Org): Promise<Org> {
        // Update product id in accounts
        await this.accountService.alignAccountWithSubscription(
            org,
            await this.accountService.getAccountByProduct(org, AccountProduct.TAG_MANAGER),
        );
        await this.accountService.alignAccountWithSubscription(
            org,
            await this.accountService.getAccountByProduct(org, AccountProduct.DATA_MANAGER),
        );

        // Update subscription data
        return this.stripeService.updateOrgSubscriptionData(org);
    }
}
