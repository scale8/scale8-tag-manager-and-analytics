import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { createRef, FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import SignUpForm from '../../../../src/components/organisms/Forms/SignUpForm';
import { SignUpValues } from '../../../../src/types/props/forms/SignUpFormProps';
import HCaptcha from '@hcaptcha/react-hcaptcha';

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
    const formProps = useMockFormProps<SignUpValues>({
        newPassword: '',
        newPasswordConfirm: '',
        domain: '',
        orgName: '',
        fullName: '',
        email: '',
        agree: false,
        CAPTCHAToken: '',
    });

    const captcha = createRef<HCaptcha>();

    return (
        <SignUpForm
            target={undefined}
            qsEmail={undefined}
            captcha={captcha}
            success={false}
            type={'tag-manager'}
            loading={false}
            {...formProps}
        />
    );
};

describe('SignUpForm', () => {
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
