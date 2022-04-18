import container from '../container/IOC.config';
import StripeSetup from '../bootstrap/StripeSetup';
import BaseLogger from '../backends/logging/abstractions/BaseLogger';
import TYPES from '../container/IOC.types';
import { Mode } from '../enums/Mode';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';

export const stripeSetup = {
    name: 'StripeSetup',
    job: async () => {
        const logger = container.get<BaseLogger>(TYPES.BackendLogger);
        const mode = container.get<BaseConfig>(TYPES.BackendConfig).getMode();
        if (mode === Mode.COMMERCIAL) {
            logger.info(`Setting up Stripe...`).then();
            await container.resolve(StripeSetup).createProductsAndPlans();
        } else {
            logger.info(`This must be run in commercial mode...`).then();
        }
    },
};
