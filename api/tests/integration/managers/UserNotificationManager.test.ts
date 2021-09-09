import ManagerTestUtils from '../../utils/ManagerTestUtils';
import TestUtils from '../../utils/TestUtils';
import UserNotificationRepo from '../../../src/mongo/repos/UserNotificationRepo';
import Mock = jest.Mock;

describe('UserNotificationManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetch UserNotification through user me', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();
        ManagerTestUtils.mockAsLoggedUser();

        const mockSutModel = TestUtils.buildMockNotification();
        const mockSutRepo = {} as UserNotificationRepo;
        mockSutRepo.find = jest.fn().mockResolvedValue([mockSutModel]);
        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockReturnValue(mockSutRepo);

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                me {
                    id
                    user_notifications {
                        id
                        type
                        is_viewed
                    }
                }
            }
        `;

        // run query against the server and snapshot the output
        const res = await server.executeOperation({ query: Q });
        expect(res).toMatchSnapshot();
    });
});
