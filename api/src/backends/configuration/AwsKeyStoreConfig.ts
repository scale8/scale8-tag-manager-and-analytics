import { inject, injectable } from 'inversify';
import BaseConfig from './abstractions/BaseConfig';
import TYPES from '../../container/IOC.types';
import EnvironmentConfig from './EnvironmentConfig';
import { SecretsManager } from 'aws-sdk';

@injectable()
export default class AwsKeyStoreConfig extends BaseConfig {
    @inject(TYPES.EnvironmentConfig) private readonly environmentConfig!: EnvironmentConfig;
    private config?: { [k: string]: any };

    private async getConfig(): Promise<{ [k: string]: any } | null> {
        const awsKeyStoreId = await this.environmentConfig.getAwsKeyStoreId();
        const awsKeyStoreSecret = await this.environmentConfig.getAwsKeyStoreSecret();
        const awsKeyStoreRegion = await this.environmentConfig.getAwsKeyStoreRegion();

        if (awsKeyStoreId === undefined || awsKeyStoreSecret === undefined) {
            return null;
        }

        if (this.config === undefined) {
            const secretsManager = new SecretsManager({
                credentials: {
                    accessKeyId: awsKeyStoreId,
                    secretAccessKey: awsKeyStoreSecret,
                },
                region: awsKeyStoreRegion,
            });

            //need to fetch from AWS Secret Manager...
            this.config = await new Promise<{ [k: string]: any }>((resolve, reject) => {
                const key = 'SCALE8_' + this.getEnvironment().toUpperCase();
                secretsManager.getSecretValue(
                    {
                        SecretId: key,
                    },
                    (err, data) => {
                        if (err || data.SecretString === undefined) {
                            reject(`Failed to fetch secret for ${key}`);
                        } else {
                            resolve(JSON.parse(data.SecretString));
                        }
                    },
                );
            });
        }
        return this.config;
    }

    async getConfigEntry(key: string): Promise<string | undefined> {
        const value = await this.environmentConfig.getConfigEntry(key);
        if (value === undefined) {
            const config = await this.getConfig();
            if (config === null) {
                return undefined;
            }
            return config[key].toString();
        } else {
            return value;
        }
    }
}
