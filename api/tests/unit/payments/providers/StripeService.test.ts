import TestUtils from '../../../utils/TestUtils';
import container from '../../../../src/container/IOC.config';
import StripeService from '../../../../src/payments/providers/StripeService';
import express from 'express';
import TYPES from '../../../../src/container/IOC.types';
import Org from '../../../../src/mongo/models/Org';
import OrgRepo from '../../../../src/mongo/repos/OrgRepo';
import RepoFromModelFactory from '../../../../src/container/factoryTypes/RepoFromModelFactory';
import OperationOwner from '../../../../src/enums/OperationOwner';
import { CT } from '../../../../src/mongo/types/Types';
import Model from '../../../../src/mongo/abstractions/Model';
import User from '../../../../src/mongo/models/User';
import UserRepo from '../../../../src/mongo/repos/UserRepo';
import TagManagerAccount from '../../../../src/mongo/models/tag/TagManagerAccount';
import DataManagerAccount from '../../../../src/mongo/models/data/DataManagerAccount';
import TagManagerAccountRepo from '../../../../src/mongo/repos/tag/TagManagerAccountRepo';
import DataManagerAccountRepo from '../../../../src/mongo/repos/data/DataManagerAccountRepo';
import StripeProducts from '../../../../src/payments/providers/StripeProducts';

describe('StripeService', () => {
    TestUtils.mockBaseConfig.isNotCommercial = jest.fn().mockReturnValue(false);

    beforeEach(TestUtils.beforeEachPrepareContainerAndDate);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('handles webhookEvents', async () => {
        TestUtils.mockLogger.info = jest.fn();

        // Mock Org
        const mockOrg = {} as Org;
        const mockOrgRepo = {} as OrgRepo;
        mockOrgRepo.findOne = jest.fn().mockResolvedValue(mockOrg);
        mockOrgRepo.save = jest.fn();

        // Mock User
        const mockUser = {} as User;
        const mockUserRepo = {} as UserRepo;
        mockUserRepo.findByIdThrows = jest.fn().mockResolvedValue(mockUser);
        mockUserRepo.save = jest.fn();

        // Mock TagManagerAccount
        const mockTagManagerAccount = {} as TagManagerAccount;
        const mockTagManagerAccountRepo = {} as TagManagerAccountRepo;
        mockTagManagerAccountRepo.findOne = jest.fn().mockResolvedValue(mockTagManagerAccount);
        mockTagManagerAccountRepo.save = jest.fn();
        mockTagManagerAccount.cancelTrial = jest.fn();

        // Mock DataManagerAccount
        const mockDataManagerAccount = {} as DataManagerAccount;
        const mockDataManagerAccountRepo = {} as DataManagerAccountRepo;
        mockDataManagerAccountRepo.findOne = jest.fn().mockResolvedValue(mockDataManagerAccount);
        mockDataManagerAccountRepo.save = jest.fn();
        mockDataManagerAccount.cancelTrial = jest.fn();

        const mockRepoFromModelFactory = jest.fn((model: string | CT<Model>) => {
            if (typeof model !== 'string') {
                if (model.name === 'Org') {
                    return mockOrgRepo;
                }
                if (model.name === 'User') {
                    return mockUserRepo;
                }
            }
            if (model === 'TagManagerAccount') {
                return mockTagManagerAccountRepo;
            }
            if (model === 'DataManagerAccount') {
                return mockDataManagerAccountRepo;
            }
            throw new Error(`Unexpected mode ${model.constructor.name}`);
        }) as RepoFromModelFactory;

        container.rebind(TYPES.RepoFromModelFactory).toConstantValue(mockRepoFromModelFactory);

        const stripeService = container.get<StripeService>(TYPES.StripeService);
        stripeService.getWebhookEvent = jest.fn().mockReturnValue({
            id: 'eventId',
            object: 'event',
            api_version: '2018-05-21',
            created: 1530291411,
            data: {
                object: {
                    id: 'subscriptionId',
                    status: 'active',
                    items: {
                        data: [
                            {
                                price: {
                                    product:
                                        StripeProducts.getTagManagerProductConfig().plans[0].id,
                                },
                            },
                            {
                                price: {
                                    product:
                                        StripeProducts.getDataManagerProductConfig().plans[0].id,
                                },
                            },
                        ],
                    },
                },
            },
            type: 'customer.subscription.created',
        });

        await stripeService.handleWebhookEvent({} as express.Request);

        expect(mockOrgRepo.findOne).toBeCalled();
        expect(mockOrgRepo.save).toBeCalledWith(
            { stripeSubscriptionId: 'subscriptionId' },
            'SYSTEM',
            OperationOwner.SYSTEM,
        );

        expect(mockUserRepo.findByIdThrows).toBeCalled();
        expect(mockUserRepo.save).toBeCalledWith(
            { canCreateDataManagerTrial: false, canCreateTagManagerTrial: false },
            'SYSTEM',
            OperationOwner.SYSTEM,
        );

        expect(mockTagManagerAccountRepo.findOne).toBeCalled();
        expect(mockTagManagerAccount.cancelTrial).toBeCalled();
        expect(mockTagManagerAccountRepo.save).toBeCalledWith(
            { ...mockTagManagerAccount, enabled: true },
            'SYSTEM',
            OperationOwner.SYSTEM,
        );

        expect(mockDataManagerAccountRepo.findOne).toBeCalled();
        expect(mockDataManagerAccount.cancelTrial).toBeCalled();
        expect(mockDataManagerAccountRepo.save).toBeCalledWith(
            { ...mockDataManagerAccount, enabled: true },
            'SYSTEM',
            OperationOwner.SYSTEM,
        );
    });
});
