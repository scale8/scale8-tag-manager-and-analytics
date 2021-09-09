import ManagerTestUtils from '../../utils/ManagerTestUtils';
import TestUtils from '../../utils/TestUtils';
import AuditRepo from '../../../src/mongo/repos/AuditRepo';
import Mock = jest.Mock;

describe('AuditManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('gets HistoryForEntities', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();

        const mockOrg = TestUtils.buildMockOrg();
        const mockAudit1 = TestUtils.buildMockAudit(mockOrg);
        const mockAudit2 = TestUtils.buildMockAudit(mockOrg, 'aaaf4c48e9615d9a1c66bccc');
        const mockSutRepo = {} as AuditRepo;
        mockSutRepo.findByIdThrows = jest.fn().mockResolvedValue(mockAudit1);
        mockSutRepo.find = jest.fn().mockResolvedValue([mockAudit1, mockAudit2]);
        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockReturnValue(mockSutRepo);

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                getHistoryForEntities(entities: ["5edf4c48e9615d9a1c66bc2a"]) {
                    id
                    user {
                        id
                        first_name
                        last_name
                    }
                    owner
                    model_id
                    model
                    model_persisting_id
                    connected_models {
                        id
                        type
                    }
                    action
                    method
                    comments
                    created_at
                }
            }
        `;

        // run query against the server and snapshot the output
        const res = await server.executeOperation({ query: Q });
        expect(res).toMatchSnapshot();
    });
});
