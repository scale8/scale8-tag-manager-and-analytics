import ManagerTestUtils from '../../../utils/ManagerTestUtils';
import TestUtils from '../../../utils/TestUtils';
import PlatformActionPermissionRepo from '../../../../src/mongo/repos/tag/PlatformActionPermissionRepo';
import Mock = jest.Mock;

describe('PlatformActionPermissionManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetches a single platform action permission', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();
        ManagerTestUtils.mockOrgUserWithViewAccessOnPlatformRevision();

        const mockSutModel = TestUtils.buildMockPlatformActionPermission();
        const mockSutRepo = {} as PlatformActionPermissionRepo;
        mockSutRepo.findByIdThrows = jest.fn().mockResolvedValue(mockSutModel);
        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockReturnValue(mockSutRepo);

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                getPlatformActionPermission(id: "5edf4c48e9615d9a1c66bc2a") {
                    id
                    permission
                }
            }
        `;

        // run query against the server and snapshot the output
        const res = await server.executeOperation({ query: Q });
        expect(res).toMatchSnapshot();
    });
});
