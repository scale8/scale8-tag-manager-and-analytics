import { injectable } from 'inversify';

@injectable()
export default abstract class BaseEmail {
    public abstract sendEmail(
        to: string,
        subject: string,
        template: string,
        vars?: { [k: string]: any },
        from?: string,
    ): Promise<void>;
}
