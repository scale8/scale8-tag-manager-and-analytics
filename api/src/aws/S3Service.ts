import { injectable } from 'inversify';
import { S3 } from 'aws-sdk';
import { AwsRegion } from '../enums/AwsRegion';
import { GetObjectOutput } from 'aws-sdk/clients/s3';

@injectable()
export default class S3Service {
    public getS3Client(accessKeyId: string, secretAccessKey: string, region: AwsRegion): S3 {
        return new S3({
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

    public getSafeBucketName(bucketName: string) {
        return bucketName.replace(/[^a-z0-9]+/g, '-');
    }

    public async bucketExists(s3Client: S3, bucketName: string): Promise<boolean> {
        return new Promise((resolve) => {
            s3Client.headBucket(
                {
                    Bucket: this.getSafeBucketName(bucketName),
                },
                (err) => resolve(err === null),
            );
        });
    }

    public async createBucket(
        s3Client: S3,
        bucketName: string,
        region: AwsRegion,
    ): Promise<boolean> {
        const params = {
            Bucket: this.getSafeBucketName(bucketName),
            CreateBucketConfiguration: {
                LocationConstraint: this.getRegionFromAwsRegion(region),
            },
        };
        return new Promise((resolve, reject) => {
            s3Client.createBucket(params, (err) => {
                console.log(JSON.stringify(params));
                err === null ? resolve(true) : reject(err);
            });
        });
    }

    public async isWriteable(s3Client: S3, bucketName: string): Promise<boolean> {
        return new Promise((resolve) => {
            s3Client.upload(
                {
                    Bucket: this.getSafeBucketName(bucketName),
                    Key: '/credential-check.txt',
                    Body: 's8',
                },
                (err) => resolve(err === null),
            );
        });
    }

    public async get(s3Client: S3, bucketName: string, key: string): Promise<GetObjectOutput> {
        return new Promise((resolve, reject) => {
            s3Client.getObject(
                {
                    Bucket: this.getSafeBucketName(bucketName),
                    Key: key,
                },
                (err, data) => {
                    if (err === null) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                },
            );
        });
    }

    public async put(s3Client: S3, params: S3.Types.PutObjectRequest): Promise<any> {
        params.Bucket = this.getSafeBucketName(params.Bucket);
        return new Promise((resolve, reject) => {
            s3Client.upload(params, (err: any) => {
                if (err === null) {
                    resolve(true);
                } else {
                    reject(err);
                }
            });
        });
    }
}
