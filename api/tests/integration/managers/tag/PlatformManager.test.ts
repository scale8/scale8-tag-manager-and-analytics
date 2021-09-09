import ManagerTestUtils from '../../../utils/ManagerTestUtils';
import TestUtils from '../../../utils/TestUtils';
import PlatformRepo from '../../../../src/mongo/repos/tag/PlatformRepo';
import Mock = jest.Mock;

describe('PlatformManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetches a single platform', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();
        ManagerTestUtils.mockOrgUserWithViewAccessOnPlatform();

        const mockSutModel = TestUtils.buildMockPlatform();
        const mockSutRepo = {} as PlatformRepo;
        mockSutRepo.findByIdThrows = jest.fn().mockResolvedValue(mockSutModel);
        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockReturnValue(mockSutRepo);

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                getPlatform(id: "5edf4c48e9615d9a1c66bc2a") {
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
