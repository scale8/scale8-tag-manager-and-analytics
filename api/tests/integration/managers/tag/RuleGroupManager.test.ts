import ManagerTestUtils from '../../../utils/ManagerTestUtils';
import TestUtils from '../../../utils/TestUtils';
import RuleGroupRepo from '../../../../src/mongo/repos/tag/RuleGroupRepo';
import Mock = jest.Mock;

describe('RuleGroupManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('fetches a single rule group', async () => {
        ManagerTestUtils.mockOrgUserWithViewAccess();

        const mockSutModel = TestUtils.buildMockRuleGroup();
        const mockSutRepo = {} as RuleGroupRepo;
        mockSutRepo.findByIdThrows = jest.fn().mockResolvedValue(mockSutModel);
        (ManagerTestUtils.mockRepoFromModelFactory as Mock).mockReturnValue(mockSutRepo);

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                getRuleGroup(id: "5edf4c48e9615d9a1c66bc2a") {
                    id
                    name
                }
            }
        `;

        // run query against the server and snapshot the output
        const res = await server.executeOperation({ query: Q });
        expect(res).toMatchSnapshot();
    });
});
