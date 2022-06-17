import container from '../container/IOC.config';
import TYPES from '../container/IOC.types';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TagManagerAccount from '../mongo/models/tag/TagManagerAccount';
import Org from '../mongo/models/Org';
import User from '../mongo/models/User';
import BaseEmail from '../backends/email/abstractions/BaseEmail';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import DataManagerAccount from '../mongo/models/data/DataManagerAccount';
import BaseLogger from '../backends/logging/abstractions/BaseLogger';
import OperationOwner from '../enums/OperationOwner';

const logger = container.get<BaseLogger>(TYPES.BackendLogger);
const config = container.get<BaseConfig>(TYPES.BackendConfig);
const mailer = container.get<BaseEmail>(TYPES.BackendEmail);
const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

const sendDaysRemainingEmail = async (account: TagManagerAccount | DataManagerAccount) => {
    const org = await repoFactory(Org).findByIdThrows(account.orgId);
    const orgOwner = await repoFactory(User).findByIdThrows(org.orgOwnerUser);

    await mailer.sendEmail(
        orgOwner.email,
        `Your free trial is ending in ${account.trialDaysRemaining()} days for ${org.name}`,
        'TrialEnding.twig',
        {
            firstName: orgOwner.firstName,
            orgName: org.name,
            trialService: account instanceof TagManagerAccount ? 'Tag Manager' : 'Data Manager',
            endingInDays: account.trialDaysRemaining(),
            uiUrl: `${await config.getUiUrl()}/login`,
        },
    );
};

const sendTrialEndedEmail = async (account: TagManagerAccount | DataManagerAccount) => {
    const org = await repoFactory(Org).findByIdThrows(account.orgId);
    const orgOwner = await repoFactory(User).findByIdThrows(org.orgOwnerUser);

    await mailer.sendEmail(
        orgOwner.email,
        `Your free trial has ended for for ${org.name}`,
        'TrialEnded.twig',
        {
            firstName: orgOwner.firstName,
            orgName: org.name,
            trialService: account instanceof TagManagerAccount ? 'Tag Manager' : 'Data Manager',
            uiUrl: `${await config.getUiUrl()}/login`,
        },
    );
};

const checkAccountStatus = async (
    accounts: AsyncGenerator<TagManagerAccount | DataManagerAccount>,
) => {
    for await (const account of accounts) {
        if (account.isOnFreeTrialIncludingExpired()) {
            const daysLeft = account.trialDaysRemaining();
            const service = account instanceof TagManagerAccount ? 'Tag Manager' : 'Data Manager';

            await logger.info(
                `Account Type: ${service} | Account ID: ${account.id} | Days Left: ${daysLeft}`,
            );
            if (daysLeft <= 10 && !account.tenDayRemainingPrompt) {
                account.tenDayRemainingPrompt = true;
                await sendDaysRemainingEmail(account);
            }
            if (daysLeft <= 3 && !account.threeDayRemainingPrompt) {
                account.threeDayRemainingPrompt = true;
                await sendDaysRemainingEmail(account);
            }
            if (daysLeft <= 2 && !account.twoDayRemainingPrompt) {
                account.twoDayRemainingPrompt = true;
                await sendDaysRemainingEmail(account);
            }
            if (daysLeft <= 1 && !account.oneDayRemainingPrompt) {
                account.oneDayRemainingPrompt = true;
                await sendDaysRemainingEmail(account);
            }
            if (daysLeft <= 0 && !account.zeroDayRemainingPrompt) {
                account.zeroDayRemainingPrompt = true;
                await sendTrialEndedEmail(account);
            }
            if (daysLeft <= -1 && !account.negativeDayRemainingPrompt) {
                account.negativeDayRemainingPrompt = true;
                await sendTrialEndedEmail(account);
            }
            if (daysLeft <= -10 && !account.negativeFinalDayRemainingPrompt) {
                account.negativeFinalDayRemainingPrompt = true;
                await sendTrialEndedEmail(account);
            }
            await repoFactory(account.constructor.name).save(account, OperationOwner.SYSTEM);
        }
    }
};

export const trialStatusEmail = {
    name: 'TrialStatusEmail',
    job: async () => {
        await checkAccountStatus(repoFactory(TagManagerAccount).findIterator({}));
        await checkAccountStatus(repoFactory(DataManagerAccount).findIterator({}));
    },
};
