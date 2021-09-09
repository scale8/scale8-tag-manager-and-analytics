import ManagerTestUtils from '../../../utils/ManagerTestUtils';
import TestUtils from '../../../utils/TestUtils';
import PlatformActionRepo from '../../../../src/mongo/repos/tag/PlatformActionRepo';
import Mock = jest.Mock;

describe('PlatformActionManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetches a single platform action', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();
        ManagerTestUtils.mockOrgUserWithViewAccessOnPlatformRevision();

        const mockSutModel = TestUtils.buildMockPlatformAction();
        const mockSutRepo = {} as PlatformActionRepo;
        mockSutRepo.findByIdThrows = jest.fn().mockResolvedValue(mockSutModel);
        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockReturnValue(mockSutRepo);

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                getPlatformAction(id: "5edf4c48e9615d9a1c66bc2a") {
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
