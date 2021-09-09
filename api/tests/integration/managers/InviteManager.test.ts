import ManagerTestUtils from '../../utils/ManagerTestUtils';
import TestUtils from '../../utils/TestUtils';
import OrgRepo from '../../../src/mongo/repos/OrgRepo';
import InviteRepo from '../../../src/mongo/repos/InviteRepo';
import Mock = jest.Mock;

describe('InviteManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetch invite through org', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();
        ManagerTestUtils.mockAsLoggedUser();

        const mockOrg = TestUtils.buildMockOrg();
        const mockOrgRepo = {} as OrgRepo;
        mockOrgRepo.findByIdThrows = jest.fn().mockResolvedValue(mockOrg);
        const mockSutModel = TestUtils.buildMockInvite();
        const mockSutRepo = {} as InviteRepo;
        mockSutRepo.find = jest.fn().mockResolvedValue([mockSutModel]);
        mockSutRepo.findOneThrows = jest.fn().mockResolvedValue(mockSutModel);
        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockImplementation((model: any) => {
            if (model.name === 'Invite') {
                return mockSutRepo;
            }
            return mockOrgRepo;
        });

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                getOrg(id: "5edf4c48e9615d9a1c66bc2a") {
                    id
                    name
                    invites {
                        id
                        email
                        org_permissions {
                            can_view
                            can_create
                            can_edit
                            can_delete
                            is_admin
                        }
                        created_at
                        updated_at
                    }
                }
            }
        `;

        // run query against the server and snapshot the output
        const res = await server.executeOperation({ query: Q });
        expect(res).toMatchSnapshot();
    });
});
