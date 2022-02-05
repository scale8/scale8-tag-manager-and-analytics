import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SecretsManager } from 'aws-sdk';

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
    return {
        statusCode: 200,
        body: `Ev: ${ev}, Secrets: ${s}`,
    };
};
