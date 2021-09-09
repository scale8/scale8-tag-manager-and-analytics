import { inject, injectable } from 'inversify';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import TYPES from '../../container/IOC.types';
import Render from '../../twig/Render';
import BaseEmail from './abstractions/BaseEmail';
import BaseLogger from '../logging/abstractions/BaseLogger';
import BaseConfig from '../configuration/abstractions/BaseConfig';

@injectable()
export default class Mailer extends BaseEmail {
    @inject(TYPES.BackendLogger) private logger!: BaseLogger;
    @inject(TYPES.Render) private render!: Render;
    @inject(TYPES.BackendConfig) private readonly config!: BaseConfig;

    private async createTransport(): Promise<Mail> {
        const transportDetails = {
            host: await this.config.getSMTPHost(),
            port: 465,
            secure: true,
            requireTLS: true,
            auth: {
                user: await this.config.getSMTPUser(),
                pass: await this.config.getSMTPPassword(),
            },
        };
        await this.logger.info('transport details', transportDetails);
        return nodemailer.createTransport(transportDetails);
    }

    public async sendEmail(
        to: string,
        subject: string,
        template: string,
        vars: { [k: string]: any } = {},
        from = `Scale8 Notifications <notifications@scale8.com>`,
    ): Promise<void> {
        const html = await this.render.fromFile(template, vars);
        await (
            await this.createTransport()
        ).sendMail({
            from: from,
            to: to,
            subject: `Scale8 - ${subject}`,
            html: html,
            attachments: [
                {
                    filename: 'email-logo.png',
                    path: `${__dirname}/../../../assets/email-logo.png`,
                    cid: 's8-email-logo',
                },
            ],
        });
    }
}
