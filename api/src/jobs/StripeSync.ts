import container from '../container/IOC.config';
import TYPES from '../container/IOC.types';
import Org from '../mongo/models/Org';
import OrgService from '../orgs/OrgService';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';

const orgService = container.get<OrgService>(TYPES.OrgService);
const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

const DELAY_MS = 500;

export const stripeSync = {
    name: 'StripeSync',
    job: async () => {
        for await (const org of repoFactory(Org).findIterator({})) {
            await orgService.alignSubscription(org);

            //sleep between calls...
            await new Promise<void>((resolve) => setTimeout(() => resolve(), DELAY_MS));
        }
    },
};
