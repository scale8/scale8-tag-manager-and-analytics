import container from '../container/IOC.config';
import Scale8Setup from '../bootstrap/Scale8Setup';
import TYPES from '../container/IOC.types';
import BaseStorage from '../backends/storage/abstractions/BaseStorage';
import StripeSetup from '../bootstrap/StripeSetup';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import { Mode } from '../enums/Mode';
import BaseLogger from '../backends/logging/abstractions/BaseLogger';

export const setupChecks = {
    name: 'SetupChecks',
    job: async () => {
        const logger = container.get<BaseLogger>(TYPES.BackendLogger);
        const mode = container.get<BaseConfig>(TYPES.BackendConfig).getMode();
        logger.info(`Running as ${mode}`).then();
        const storage = container.get<BaseStorage>(TYPES.BackendStorage);
        logger.info(`Running configure for storage engine '${storage.constructor.name}'...`).then();
        await storage.configure();
        logger.info(`Configured '${storage.constructor.name}'...`).then();
        if (mode === Mode.COMMERCIAL) {
            logger.info(`Setting up Stripe...`).then();
            await container.resolve(StripeSetup).createProductsAndPlans();
        }
        logger.info(`Running Scale8 Setup...`).then();
        await container.resolve(Scale8Setup).setup();
        logger.info(`Completed Scale8 Setup...`).then();
    },
};
