import LoggedOutTemplate from '../../../../src/components/templates/containers/LoggedOutTemplate';
import * as nextRouter from 'next/router';
import { render } from '@testing-library/react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
nextRouter.useRouter = jest.fn();
(nextRouter.useRouter as jest.Mock).mockImplementation(() => ({ route: '/' }));

describe('LoggedOutTemplate', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('renders LoggedOutTemplate unchanged', () => {
        const { asFragment } = render(
            <LoggedOutTemplate>
                <div />
            </LoggedOutTemplate>,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
