import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SecretsManager } from 'aws-sdk';
import container from '../container/IOC.config';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import TYPES from '../container/IOC.types';
import { add, format } from 'date-fns';

// Create a Secrets Manager client
const client = new SecretsManager({
    region: 'eu-central-1',
});

async function getSecret() {
    return new Promise((resolve, reject) => {
        client.getSecretValue({ SecretId: 'SCALE8_DEVELOPMENT' }, function (err, data) {
            if (err) {
                // handle all exceptions and take appropriate actions
                reject(err);
            } else {
                resolve(data.SecretString);
            }
        });
    });
}

export const lambdaHandler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const ev = JSON.stringify(event);
    const s = await getSecret();
    const config = container.get<BaseConfig>(TYPES.BackendConfig);
    const date = format(
        add(new Date(), {
            days: 30,
        }),
        'MM-dd-yy',
    );

    return {
        statusCode: 200,
        body: `Ev: ${ev}, configEntry: ${config.getEnvironment()} , Date: ${date}, Secrets: ${s}`,
    };
};
