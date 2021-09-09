import express from 'express';
import { inject, injectable } from 'inversify';
import Handler from './abstractions/Handler';
import TYPES from '../../container/IOC.types';
import StripeService from '../../payments/providers/StripeService';

@injectable()
export default class StripeWebhook extends Handler {
    @inject(TYPES.StripeService) protected readonly stripeService!: StripeService;

    public getHandler() {
        return async (req: express.Request, res: express.Response) => {
            await this.stripeService.handleWebhookEvent(req);
            res.send('ok');
        };
    }
}
