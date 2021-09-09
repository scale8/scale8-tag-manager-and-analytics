import Mock = jest.Mock;
import ManagerTestUtils from '../../../utils/ManagerTestUtils';
import TestUtils from '../../../utils/TestUtils';
import DataManagerAccountRepo from '../../../../src/mongo/repos/data/DataManagerAccountRepo';
import OrgRepo from '../../../../src/mongo/repos/OrgRepo';

describe('DataManagerAccountManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetches data manager account', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();

        const mockOrg = TestUtils.buildMockOrg();
        const mockOrgRepo = {} as OrgRepo;
        mockOrgRepo.findByIdThrows = jest.fn().mockResolvedValue(mockOrg);
        const mockSutModel = TestUtils.buildDataManagerAccount();
        const mockSutRepo = {} as DataManagerAccountRepo;
        mockSutRepo.findByIdThrows = jest.fn().mockResolvedValue(mockSutModel);

        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockImplementation((model: any) => {
            if (model.name === 'Org') {
                return mockOrgRepo;
            }
            return mockSutRepo;
        });

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                getDataManagerAccount(id: "5edf4c48e9615d9a1c66bc2a") {
                    id
                    org {
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
