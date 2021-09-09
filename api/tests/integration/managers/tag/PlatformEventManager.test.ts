import ManagerTestUtils from '../../../utils/ManagerTestUtils';
import TestUtils from '../../../utils/TestUtils';
import PlatformEventRepo from '../../../../src/mongo/repos/tag/PlatformEventRepo';
import Mock = jest.Mock;

describe('PlatformEventManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetches a single platform event', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();
        ManagerTestUtils.mockOrgUserWithViewAccessOnPlatformRevision();

        const mockSutModel = TestUtils.buildMockPlatformEvent();
        const mockSutRepo = {} as PlatformEventRepo;
        mockSutRepo.findByIdThrows = jest.fn().mockResolvedValue(mockSutModel);
        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockReturnValue(mockSutRepo);

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                getPlatformEvent(id: "5edf4c48e9615d9a1c66bc2a") {
                    id
                    name
                }
            }
        `;

        // run query against the server and snapshot the output
        const res = await server.executeOperation({ query: Q });
        expect(res).toMatchSnapshot();
    });
});
