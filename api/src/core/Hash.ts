import crypto from 'crypto';

export default class Hash {
    public static hashString(str: string, salt = ''): string {
        return crypto
            .createHash('sha512')
            .update(str + salt)
            .digest('base64');
    }

    public static simpleRandomHash(size = 20): string {
        return crypto.randomBytes(size).toString('hex');
    }

    public static shortRandomHash(): string {
        return (
            crypto.randomBytes(4).toString('hex') +
            '-' +
            new Date().getTime().toString(16) +
            '-' +
            crypto.randomBytes(4).toString('hex')
        );
    }

    public static randomHash(salt: string): string {
        return this.hashString(
            crypto.randomBytes(20).toString('hex') +
                crypto.randomBytes(20).toString('hex') +
                new Date().getTime().toString() +
                crypto.randomBytes(20).toString('hex'),
            salt,
        );
    }
}
