import ManagerTestUtils from '../../../utils/ManagerTestUtils';
import TestUtils from '../../../utils/TestUtils';
import IngestEndpointDataMapRepo from '../../../../src/mongo/repos/data/IngestEndpointDataMapRepo';
import Mock = jest.Mock;

describe('IngestEndpointDataMapManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetches ingest endpoint DataMap', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();

        const mockSutModel = TestUtils.buildIngestEndpointDataMap();
        const mockSutRepo = {} as IngestEndpointDataMapRepo;
        mockSutRepo.findByIdThrows = jest.fn().mockResolvedValue(mockSutModel);

        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockReturnValue(mockSutRepo);

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                getIngestEndpointDataMap(id: "5edf4c48e9615d9a1c66bc2a") {
                    id
                    key
                    var_type
                    default_value {
                        __typename
                        ... on DefaultValueContainer {
                            value
                        }
                        ... on DefaultValueContainerArray {
                            values
                        }
                    }
                    is_optional
                    validation_rules {
                        type
                        input_value
                    }
                }
            }
        `;

        // run query against the server and snapshot the output
        const res = await server.executeOperation({ query: Q });
        expect(res).toMatchSnapshot();
    });
});
