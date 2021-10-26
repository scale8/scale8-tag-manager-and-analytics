import { injectable } from 'inversify';
import BaseConfig from './abstractions/BaseConfig';

@injectable()
export default class EnvironmentConfig extends BaseConfig {
    public async dump() {
        console.log(process.env);
    }

    async getConfigEntry(key: string): Promise<string | undefined> {
        return process.env[key];
    }
}
