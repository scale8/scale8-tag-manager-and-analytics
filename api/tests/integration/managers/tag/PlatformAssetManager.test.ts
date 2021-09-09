import ManagerTestUtils from '../../../utils/ManagerTestUtils';
import TestUtils from '../../../utils/TestUtils';
import PlatformRevisionRepo from '../../../../src/mongo/repos/tag/PlatformRevisionRepo';
import PlatformAssetRepo from '../../../../src/mongo/repos/tag/PlatformAssetRepo';
import Mock = jest.Mock;

describe('PlatformAssetManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetches a platform asset via platform', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();
        ManagerTestUtils.mockOrgUserWithViewAccessOnPlatformRevision();

        const mockPlatformRevision = TestUtils.buildMockPlatformRevision();
        const mockPlatformRevisionRepo = {} as PlatformRevisionRepo;
        mockPlatformRevisionRepo.findByIdThrows = jest.fn().mockResolvedValue(mockPlatformRevision);
        const mockSutModel = TestUtils.buildMockPlatformAsset();
        const mockSutRepo = {} as PlatformAssetRepo;
        mockSutRepo.find = jest.fn().mockResolvedValue([mockSutModel]);
        mockSutRepo.findOneThrows = jest.fn().mockResolvedValue(mockSutModel);
        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockImplementation((model: any) => {
            if (model.name === 'PlatformAsset') {
                return mockSutRepo;
            }
            return mockPlatformRevisionRepo;
        });

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                getPlatformRevision(id: "5edf4c48e9615d9a1c66bc2a") {
                    id
                    platform_assets {
                        id
                        name
                    }
                }
            }
        `;

        // run query against the server and snapshot the output
        const res = await server.executeOperation({ query: Q });
        expect(res).toMatchSnapshot();
    });
});
