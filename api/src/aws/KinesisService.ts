import { injectable } from 'inversify';
import { Firehose } from 'aws-sdk';
import { AwsRegion } from '../enums/AwsRegion';
import { Buffer } from 'buffer';

@injectable()
export default class KinesisService {
    public getKinesisClient(
        accessKeyId: string,
        secretAccessKey: string,
        region: AwsRegion,
    ): Firehose {
        return new Firehose({
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
            region: this.getRegionFromAwsRegion(region),
        });
    }

    public getRegionFromAwsRegion(region: AwsRegion): string {
        return region.toLowerCase().replace(/_/g, '-');
    }

    public isStreamWriteable(firehose: Firehose, streamName: string): Promise<boolean> {
        return new Promise((resolve) => {
            firehose.putRecord(
                {
                    DeliveryStreamName: streamName,
                    Record: {
                        Data: Buffer.from(JSON.stringify({ test: true })),
                    },
                },
                (err) => resolve(!err),
            );
        });
    }
}
