import dotenv from 'dotenv';
import container from './container/IOC.config';
import APIServer from './APIServer';

//register .env as soon as possible...
dotenv.config();

(async () => {
    await container.resolve(APIServer).startServer();
})();
