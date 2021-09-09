import DataManagerAccount from '../mongo/models/data/DataManagerAccount';
import TagManagerAccount from '../mongo/models/tag/TagManagerAccount';
import Usage from '../mongo/models/Usage';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import CTX from '../gql/ctx/CTX';
import OrgAuth from '../auth/OrgAuth';
import GenericError from '../errors/GenericError';
import { fetchOrg } from './OrgUtils';
import StripeService from '../payments/providers/StripeService';
import UsageRepo from '../mongo/repos/UsageRepo';
import { LogPriority } from '../enums/LogPriority';

/**
 * Gets the current billing cycle
 *
 * @param account
 */
export const getUsageCycle = async (
    account: TagManagerAccount | DataManagerAccount,
): Promise<{ start: Date; end: Date } | undefined> => {
    const stripeService = container.get<StripeService>(TYPES.StripeService);

    if (account.isOnFreeTrial()) {
        if (account.trialStartedOn === undefined || account.trialExpiresOn === undefined) {
            throw new GenericError('Unable to get trial dates', LogPriority.DEBUG);
        }
        return {
            start: account.trialStartedOn,
            end: account.trialExpiresOn,
        };
    } else {
        const subscription = await stripeService.getStripeSubscription(
            await fetchOrg(account.orgId),
        );
        if (subscription === undefined) {
            return undefined;
        } else {
            return {
                start: new Date(subscription.current_period_start),
                end: new Date(subscription.current_period_end),
            };
        }
    }
};

/**
 * Gets the usage for the current billing cycle
 *
 * @param account
 * @param ctx
 */
export const usageFromAccount = async (
    account: DataManagerAccount | TagManagerAccount,
    ctx: CTX,
): Promise<Promise<{ requests: number; day: Date }[]>> => {
    const orgAuth = container.get<OrgAuth>(TYPES.OrgAuth);
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    return orgAuth.asUserWithViewAccess(ctx, account.orgId, async () => {
        const billingCycle = await getUsageCycle(account);
        return billingCycle === undefined
            ? []
            : (
                  await repoFactory<UsageRepo>(Usage).getUsageDataForAccount(
                      account,
                      billingCycle.start,
                      billingCycle.end,
                  )
              ).map((_) => {
                  return {
                      day: _.day,
                      requests: _.requests,
                  };
              });
    });
};
