import renderer from 'react-test-renderer';
import * as nextRouter from 'next/router';
import LoggedInTemplate from '../../../../src/components/templates/containers/LoggedInTemplate';
import theme from '../../../../src/theme';
import { ThemeProvider } from '@mui/styles';
import { StyledEngineProvider } from '@mui/styled-engine';
import { Theme } from '@mui/system';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
nextRouter.useRouter = jest.fn();
(nextRouter.useRouter as jest.Mock).mockImplementation(() => ({ route: '/' }));

jest.mock('@mui/material/Portal', () => '');
// (
//     {
//     render: function () {
//         return <></>;
//     },
//     getMountNode: function () {
//         return null;
//     },
// }));

describe('LoggedInTemplate', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('renders LoggedInTemplate unchanged', () => {
        const tree = renderer
            .create(
                <StyledEngineProvider injectFirst>
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
                    </ThemeProvider>
                </StyledEngineProvider>,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
