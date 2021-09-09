import ManagerTestUtils from '../../utils/ManagerTestUtils';
import TestUtils from '../../utils/TestUtils';

describe('UserManager', () => {
    beforeEach(ManagerTestUtils.beforeEachPrepareContainer);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('get me', async () => {
        ManagerTestUtils.mockAsLoggedUser();

        const server = TestUtils.createApolloServerForIntegration();

        const Q = `
            query {
                me {
                    id
                    first_name
                    last_name
                    email
                    is_admin
                }
            }
        `;

        // run query against the server and snapshot the output
        const res = await server.executeOperation({ query: Q });
        expect(res).toMatchSnapshot();
    });
});
