import container from '../container/IOC.config';
import TYPES from '../container/IOC.types';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TagManagerAccount from '../mongo/models/tag/TagManagerAccount';
import OperationOwner from '../enums/OperationOwner';
import Org from '../mongo/models/Org';
import User from '../mongo/models/User';
import BaseEmail from '../backends/email/abstractions/BaseEmail';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import DataManagerAccount from '../mongo/models/data/DataManagerAccount';

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
            uiUrl: `${await config.getUiUrl()}/login`,
        },
    );
};

const checkAccountStatus = async (
    accounts: AsyncGenerator<TagManagerAccount | DataManagerAccount>,
) => {
    for await (const account of accounts) {
        if (account.trialDaysRemaining() <= 10 && !account.tenDayRemainingPrompt) {
            account.tenDayRemainingPrompt = true;
            await sendDaysRemainingEmail(account);
        }
        if (account.trialDaysRemaining() <= 3 && !account.threeDayRemainingPrompt) {
            account.threeDayRemainingPrompt = true;
            await sendDaysRemainingEmail(account);
        }
        if (account.trialDaysRemaining() <= 2 && !account.twoDayRemainingPrompt) {
            account.twoDayRemainingPrompt = true;
            await sendDaysRemainingEmail(account);
        }
        if (account.trialDaysRemaining() <= 1 && !account.oneDayRemainingPrompt) {
            account.oneDayRemainingPrompt = true;
            await sendDaysRemainingEmail(account);
        }
        if (account.trialExpired() && !account.zeroDayRemainingPrompt) {
            account.zeroDayRemainingPrompt = true;
            await sendTrialEndedEmail(account);
        }
        if (account.trialExpired() && !account.negativeDayRemainingPrompt) {
            account.negativeDayRemainingPrompt = true;
            await sendTrialEndedEmail(account);
        }
        if (account.trialExpired() && !account.negativeFinalDayRemainingPrompt) {
            account.negativeFinalDayRemainingPrompt = true;
            await sendTrialEndedEmail(account);
        }
        await repoFactory(account.constructor.name).save(account, OperationOwner.SYSTEM);
    }
};

export const trialStatusEmail = {
    name: 'TrialStatusEmail',
    job: async () => {
        await checkAccountStatus(repoFactory(TagManagerAccount).findIterator({}));
        await checkAccountStatus(repoFactory(DataManagerAccount).findIterator({}));
    },
};
