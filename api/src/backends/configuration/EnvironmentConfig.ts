import { injectable } from 'inversify';
import BaseConfig from './abstractions/BaseConfig';

@injectable()
export default class EnvironmentConfig extends BaseConfig {
    async getConfigEntry(key: string): Promise<string | undefined> {
        return process.env[key];
    }
}
