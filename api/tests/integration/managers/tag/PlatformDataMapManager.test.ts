import ManagerTestUtils from '../../../utils/ManagerTestUtils';
import TestUtils from '../../../utils/TestUtils';
import DataMapRepo from '../../../../src/mongo/repos/tag/DataMapRepo';
import PlatformEventRepo from '../../../../src/mongo/repos/tag/PlatformEventRepo';
import Mock = jest.Mock;

describe('PlatformDataMapManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetches a platform data map via event', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();
        ManagerTestUtils.mockOrgUserWithViewAccessOnPlatformRevision();

        const mockEventModel = TestUtils.buildMockPlatformEvent();
        const mockEventRepo = {} as PlatformEventRepo;
        mockEventRepo.findByIdThrows = jest.fn().mockResolvedValue(mockEventModel);
        const mockSutModel = TestUtils.buildMockPlatformDataMap();
        const mockSutRepo = {} as DataMapRepo;
        mockSutRepo.findByIdThrows = jest.fn().mockResolvedValue(mockSutModel);
        mockSutRepo.findByIds = jest.fn().mockResolvedValue([mockSutModel]);

        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockImplementation((model: any) => {
            if (model.name === 'PlatformEvent') {
                return mockEventRepo;
            }
            return mockSutRepo;
        });

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                getPlatformEvent(id: "5edf4c48e9615d9a1c66bc2a") {
                    id
                    name
                    platform_data_maps {
                        ...platformDatamapsFields
                    }
                }
            }
            fragment platformDatamapsFields on PlatformDataMap {
                id
                key
                var_type
                input_type
                description
                icon
                option_values
                validation_rules {
                    type
                    input_value
                }
                is_optional
                default_value {
                    __typename
                    ... on DefaultValueContainer {
                        value
                    }
                    ... on DefaultValueContainerArray {
                        values
                    }
                }
            }
        `;

        // run query against the server and snapshot the output
        const res = await server.executeOperation({ query: Q });
        expect(res).toMatchSnapshot();
    });
});
