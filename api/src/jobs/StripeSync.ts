import container from '../container/IOC.config';
import TYPES from '../container/IOC.types';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import Org from '../mongo/models/Org';
import OrgManager from '../managers/OrgManager';

const orgManager = container.get<OrgManager>(TYPES.OrgManager);
const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

const DELAY_MS = 500;

export const stripeSync = {
    name: 'StripeSync',
    job: async () => {
        for await (const org of repoFactory(Org).findIterator({})) {
            await orgManager.updateOrgBillingCycle(org);
            //sleep between calls...
            await new Promise<void>((resolve) => setTimeout(() => resolve(), DELAY_MS));
        }
    },
};
