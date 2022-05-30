import LoggedInTemplate from '../../../../src/components/templates/containers/LoggedInTemplate';
import theme from '../../../../src/theme';
import { ThemeProvider } from '@mui/material';
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

describe('LoggedInTemplate', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('renders LoggedInTemplate unchanged', () => {
        const { asFragment } = render(
            <ThemeProvider theme={theme}>
                <LoggedInTemplate
                    breadcrumb={<div />}
                    cancelConfirmDialogProps={{
                        open: false,
                        handleCancel: jest.fn(),
                        handleConfirm: jest.fn(),
                        text: 'something',
                    }}
                    sideBarProps={{
                        handleNotificationClick: jest.fn(),
                        userSelectorProps: {
                            loading: false,
                            userName: 'name',
                            userEmail: 'email',
                            handleAccountClick: jest.fn(),
                            handleLogoutClick: jest.fn(),
                        },
                        isAdmin: true,
                        unreadNotifications: 5,
                    }}
                    sideMenu={<div />}
                >
                    <div>
                        <div />
                    </div>
                </LoggedInTemplate>{' '}
            </ThemeProvider>,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
