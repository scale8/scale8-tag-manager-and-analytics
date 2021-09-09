import ManagerTestUtils from '../../../utils/ManagerTestUtils';
import TestUtils from '../../../utils/TestUtils';
import AppPlatformRevisionRepo from '../../../../src/mongo/repos/tag/AppPlatformRevisionRepo';
import Mock = jest.Mock;

describe('AppPlatformRevisionManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetches a single app platform revision', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();
        ManagerTestUtils.mockOrgUserWithViewAccessOnPlatform();
        ManagerTestUtils.mockOrgUserWithViewAccessOnPlatformRevision();

        const mockSutModel = TestUtils.buildMockAppPlatformRevision();
        const mockSutRepo = {} as AppPlatformRevisionRepo;
        mockSutRepo.findByIdThrows = jest.fn().mockResolvedValue(mockSutModel);
        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockReturnValue(mockSutRepo);

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                getAppPlatformRevision(id: "5edf4c48e9615d9a1c66bc2a") {
                    id
                    platform_revision {
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
