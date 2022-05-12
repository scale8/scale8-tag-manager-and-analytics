import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import LoginForm from '../../../../src/components/organisms/Forms/LoginForm';
import { LoginValues } from '../../../../src/types/props/forms/LoginFormProps';
import * as nextRouter from 'next/router';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
nextRouter.useRouter = jest.fn();
(nextRouter.useRouter as jest.Mock).mockImplementation(() => ({ route: '/' }));

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
