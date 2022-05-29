import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import LoginForm from '../../../../src/components/organisms/Forms/LoginForm';
import { LoginValues } from '../../../../src/types/props/forms/LoginFormProps';

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

const MockForm: FC = () => {
    const formProps = useMockFormProps<LoginValues>({
        email: '',
        password: '',
    });

    return (
        <LoginForm
            {...formProps}
            handleGithubButtonClick={() => {
                /*Idle*/
            }}
            ssoError=""
        />
    );
};

describe('LoginForm', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('form render unchanged', () => {
        const { asFragment } = render(
            <ThemeProvider theme={theme}>
                <MockForm />
            </ThemeProvider>,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
