import { injectable } from 'inversify';
import { S3 } from 'aws-sdk';
import { AwsRegion } from '../enums/AwsRegion';

@injectable()
export default class S3Service {
    public getS3Client(accessKeyId: string, secretAccessKey: string, region: AwsRegion): S3 {
        return new S3({
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
            region: region.toLowerCase().replace(/_/g, '-'),
        });
    }

    public async bucketExists(s3Client: S3, bucketName: string): Promise<boolean> {
        return new Promise((resolve) => {
            s3Client.headBucket(
                {
                    Bucket: bucketName,
                },
                (err) => resolve(err === null),
            );
        });
    }

    public async isWriteable(s3Client: S3, bucketName: string): Promise<boolean> {
        return new Promise((resolve) => {
            s3Client.upload(
                {
                    Bucket: bucketName,
                    Key: '/credential-check.txt',
                    Body: 's8',
                },
                (err) => resolve(err === null),
            );
        });
    }
}
