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

    private async createMissingPrice(
        id: string,
        amount: number,
        metadata: { [k: string]: any },
    ): Promise<Stripe.Price> {
        const stripe = await this.stripeService.getStripe();
        const currentPrices = await this.getPrice(id);
        const price = currentPrices.find((currentPrice) => currentPrice.lookup_key === id);

        return price === undefined
            ? stripe.prices.create({
                  unit_amount: amount,
                  recurring: { interval: 'month' },
                  currency: 'usd',
                  tax_behavior: 'exclusive',
                  product: id,
                  metadata: metadata,
                  lookup_key: id,
              })
            : price;
    }

    private async createMissingProduct(id: string, name: string): Promise<Stripe.Product> {
        const stripe = await this.stripeService.getStripe();
        const product = await this.getProduct(id);
        if (product === undefined) {
            await this.logger.info(`Creating product for plan: ${id}`);
            return await stripe.products.create({
                id: id,
                name: name,
                tax_code: 'txcd_10103001',
            });
        } else if (product.name !== name) {
            await this.logger.info(`Updating product for plan: ${id}`);
            return await stripe.products.update(id, {
                name: name,
            });
        } else {
            return product;
        }
    }

    public async createProductsAndPlans() {
        await Future.runInSerial(
            StripeProducts.getTagManagerProductConfig().plans.map(
                (_) => () =>
                    new Promise<void>((resolve) => {
                        setTimeout(() => {
                            this.logger.info(`Checking product plan: ${_.id}`);
                            this.createMissingProduct(_.id, _.name).then(() =>
                                this.createMissingPrice(_.id, _.amount, {
                                    page_views: _.page_views,
                                    account_type: 'TagManagerAccount',
                                }).then(() => resolve()),
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
                                this.createMissingPrice(_.id, _.amount, {
                                    requests: _.requests,
                                    gbs: _.gbs,
                                    account_type: 'DataManagerAccount',
                                }).then(() => resolve()),
                            );
                        }, this.DELAY_MS);
                    }),
            ),
        );
    }
}
