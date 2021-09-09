import ManagerTestUtils from '../../../utils/ManagerTestUtils';
import TestUtils from '../../../utils/TestUtils';
import EventRepo from '../../../../src/mongo/repos/tag/EventRepo';
import DataMapRepo from '../../../../src/mongo/repos/tag/DataMapRepo';
import { ObjectID } from 'mongodb';
import Mock = jest.Mock;

describe('DataMapManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetches a data map via event', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();

        const mockEventModel = TestUtils.buildMockEvent();
        const mockEventRepo = {} as EventRepo;
        mockEventRepo.findByIdThrows = jest.fn().mockResolvedValue(mockEventModel);
        const mockSutModel = TestUtils.buildMockDataMap();
        const mockSutRepo = {} as DataMapRepo;
        mockSutRepo.findByIdThrows = jest.fn().mockResolvedValue(mockSutModel);
        mockSutRepo.findByIds = jest.fn().mockResolvedValue([mockSutModel]);

        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockImplementation((model: any) => {
            if (model.name === 'Event') {
                return mockEventRepo;
            }
            return mockSutRepo;
        });

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                getEvent(id: "5edf4c48e9615d9a1c66bc2a") {
                    id
                    data_maps {
                        ...datamapsFields
                    }
                }
            }

            fragment datamapsFields on DataMap {
                id
                key
                var_type
                value {
                    __typename
                    ... on DataMapValueContainer {
                        value
                    }
                    ... on DataMapValueContainerArray {
                        values
                    }
                    ... on DataMapObject {
                        object {
                            ...datamapsFieldsLvl1
                        }
                    }
                    ... on DataMapObjects {
                        objects {
                            ...datamapsFieldsLvl1
                        }
                    }
                }
            }

            fragment datamapsFieldsLvl1 on DataMap {
                id
                key
                var_type
                value {
                    __typename
                    ... on DataMapValueContainer {
                        value
                    }
                    ... on DataMapValueContainerArray {
                        values
                    }
                    ... on DataMapObject {
                        object {
                            ...datamapsFieldsLvl2
                        }
                    }
                    ... on DataMapObjects {
                        objects {
                            ...datamapsFieldsLvl2
                        }
                    }
                }
            }

            fragment datamapsFieldsLvl2 on DataMap {
                id
                key
                var_type
                value {
                    __typename
                    ... on DataMapValueContainer {
                        value
                    }
                    ... on DataMapValueContainerArray {
                        values
                    }
                }
            }
        `;

        // run query against the server and snapshot the output
        const res = await server.executeOperation({ query: Q });
        expect(res).toMatchSnapshot();
        expect(mockSutRepo.findByIds).toHaveBeenCalledWith([
            new ObjectID('5edf4c48e9615d9a1c66cccc'),
        ]);
    });
});
