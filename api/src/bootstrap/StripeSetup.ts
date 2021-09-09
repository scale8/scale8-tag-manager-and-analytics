import Stripe from 'stripe';
import { inject, injectable } from 'inversify';
import TYPES from '../container/IOC.types';
import StripeService from '../payments/providers/StripeService';
import BaseLogger from '../backends/logging/abstractions/BaseLogger';
import StripeProducts from '../payments/providers/StripeProducts';
import Future from '../core/Future';

@injectable()
export default class StripeSetup {
    @inject(TYPES.BackendLogger) protected readonly logger!: BaseLogger;
    @inject(TYPES.StripeService) protected readonly stripeService!: StripeService;

    protected readonly DELAY_MS = 30;

    private async getProduct(id: string): Promise<Stripe.Product | undefined> {
        const stripe = await this.stripeService.getStripe();
        const products = await stripe.products.list({ ids: [id] });
        return products.data.find((_) => _.id === id);
    }

    private async getPrice(productId: string): Promise<Stripe.Price[]> {
        const stripe = await this.stripeService.getStripe();
        return (await stripe.prices.list({ product: productId })).data;
    }

    private async createMissingPricing(
        productId: string,
        plans: { id: string; amount: number; metadata: { [k: string]: any } }[],
    ): Promise<Stripe.Price[]> {
        const stripe = await this.stripeService.getStripe();
        const currentPrices = await this.getPrice(productId);
        return (await Promise.all(
            plans.map(async (_) => {
                const price = currentPrices.find(
                    (currentPrice) => currentPrice.lookup_key === _.id,
                );
                return price === undefined
                    ? stripe.prices.create({
                          unit_amount: _.amount,
                          recurring: { interval: 'month' },
                          currency: 'usd',
                          product: productId,
                          metadata: _.metadata,
                          lookup_key: _.id,
                      })
                    : price;
            }),
        )) as Stripe.Price[];
    }

    private async createMissingProduct(id: string, name: string): Promise<Stripe.Product> {
        const stripe = await this.stripeService.getStripe();
        const product = await this.getProduct(id);
        return product === undefined
            ? await stripe.products.create({
                  id: id,
                  name: name,
              })
            : product;
    }

    public async createProductsAndPlans() {
        await Future.runInSerial(
            StripeProducts.getTagManagerProductConfig().plans.map(
                (_) => () =>
                    new Promise<void>((resolve) => {
                        setTimeout(() => {
                            this.logger.info(`Checking product plan: ${_.id}`);
                            this.createMissingProduct(_.id, _.name).then(() =>
                                this.createMissingPricing(_.id, [
                                    {
                                        id: _.id,
                                        amount: _.amount,
                                        metadata: {
                                            page_views: _.page_views,
                                            account_type: 'TagManagerAccount',
                                        },
                                    },
                                ]).then(() => resolve()),
                            );
                        }, this.DELAY_MS);
                    }),
            ),
        );
        await Future.runInSerial(
            StripeProducts.getDataManagerProductConfig().plans.map(
                (_) => () =>
                    new Promise<void>((resolve) => {
                        setTimeout(() => {
                            this.logger.info(`Checking product plan: ${_.id}`);
                            this.createMissingProduct(_.id, _.name).then(() =>
                                this.createMissingPricing(_.id, [
                                    {
                                        id: _.id,
                                        amount: _.amount,
                                        metadata: {
                                            requests: _.requests,
                                            gbs: _.gbs,
                                            account_type: 'DataManagerAccount',
                                        },
                                    },
                                ]).then(() => resolve()),
                            );
                        }, this.DELAY_MS);
                    }),
            ),
        );
    }
}
