import dotenv from 'dotenv';
import container from './container/IOC.config';
import APIServer from './APIServer';
import BaseConfig from './backends/configuration/abstractions/BaseConfig';
import TYPES from './container/IOC.types';
import setupCheck from './utils/SetupCheckUtils';

//register .env as soon as possible...
dotenv.config();

(async () => {
    await container.resolve(APIServer).startServer();
    if (container.get<BaseConfig>(TYPES.BackendConfig).isSetupMode()) {
        await setupCheck();
    }
})();
