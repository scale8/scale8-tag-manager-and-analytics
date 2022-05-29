import LoggedOutTemplate from '../../../../src/components/templates/containers/LoggedOutTemplate';
import { render } from '@testing-library/react';

jest.mock('next/router', () => ({
    useRouter() {
        return {
            route: '/',
            pathname: '',
            query: '',
            asPath: '',
            push: jest.fn(),
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
            beforePopState: jest.fn(() => null),
            prefetch: jest.fn(() => null),
        };
    },
}));

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
