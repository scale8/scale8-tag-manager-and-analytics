import renderer from 'react-test-renderer';
import LoggedOutTemplate from '../../../../src/components/templates/containers/LoggedOutTemplate';
import * as nextRouter from 'next/router';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
nextRouter.useRouter = jest.fn();
(nextRouter.useRouter as jest.Mock).mockImplementation(() => ({ route: '/' }));
describe('LoggedOutTemplate', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('renders LoggedOutTemplate unchanged', () => {
        const tree = renderer
            .create(
                <LoggedOutTemplate>
                    <div />
                </LoggedOutTemplate>,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
