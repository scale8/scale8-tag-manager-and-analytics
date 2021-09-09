import Mock = jest.Mock;
import ManagerTestUtils from '../../../utils/ManagerTestUtils';
import TestUtils from '../../../utils/TestUtils';
import DataManagerAccountRepo from '../../../../src/mongo/repos/data/DataManagerAccountRepo';
import OrgRepo from '../../../../src/mongo/repos/OrgRepo';

describe('TagManagerAccountManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetches tag manager account', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();

        const mockOrg = TestUtils.buildMockOrg();
        const mockOrgRepo = {} as OrgRepo;
        mockOrgRepo.findByIdThrows = jest.fn().mockResolvedValue(mockOrg);
        const mockSutModel = TestUtils.buildTagManagerAccount();
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
                getTagManagerAccount(id: "5edf4c48e9615d9a1c66bc2a") {
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
