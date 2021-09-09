import ManagerTestUtils from '../../../utils/ManagerTestUtils';
import TestUtils from '../../../utils/TestUtils';
import IngestEndpointDataMapRepo from '../../../../src/mongo/repos/data/IngestEndpointDataMapRepo';
import Mock = jest.Mock;

describe('IngestEndpointEnvironmentManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetches ingest endpoint environment', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();

        const mockSutModel = TestUtils.buildIngestEndpointEnvironment();
        const mockSutRepo = {} as IngestEndpointDataMapRepo;
        mockSutRepo.findByIdThrows = jest.fn().mockResolvedValue(mockSutModel);

        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockReturnValue(mockSutRepo);

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                getIngestEndpointEnvironment(id: "5edf4c48e9615d9a1c66bc2a") {
                    id
                    name
                    custom_domain
                    ingest_endpoint_revision {
                        id
                    }
                }
            }
        `;

        // run query against the server and snapshot the output
        const res = await server.executeOperation({ query: Q });
        expect(res).toMatchSnapshot();
    });
});
