import { inject, injectable } from 'inversify';
import TYPES from '../container/IOC.types';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import StripeService from '../payments/providers/StripeService';
import Org from '../mongo/models/Org';

@injectable()
export default class OrgService {
    @inject(TYPES.RepoFromModelFactory) protected repoFactory!: RepoFromModelFactory;
    @inject(TYPES.StripeService) protected readonly stripeService!: StripeService;

    public async updateOrgBillingCycle(org: Org): Promise<void> {
        const cycle = await this.stripeService.getBillingCycle(org);
        org.billingStart = cycle?.start;
        org.billingEnd = cycle?.end;
        await this.repoFactory(Org).save(org, 'SYSTEM');
    }
}
