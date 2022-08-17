import container from '../container/IOC.config';
import TYPES from '../container/IOC.types';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import Org from '../mongo/models/Org';
import User from '../mongo/models/User';
import BaseEmail from '../backends/email/abstractions/BaseEmail';

const mailer = container.get<BaseEmail>(TYPES.BackendEmail);
const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

export const serviceTermination = {
    name: 'ServiceTermination',
    job: async () => {
        const orgs = await repoFactory(Org).findIterator({});

        for await (const org of orgs) {
            const orgOwner = await repoFactory(User).findByIdThrows(org.orgOwnerUser);

            await mailer.sendEmail(
                orgOwner.email,
                `Scale8 - (Hosted Version) - Service Termination Notice`,
                'ServiceTermination.twig',
                {
                    firstName: orgOwner.firstName,
                    orgName: org.name,
                },
            );
        }
    },
};
