import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import ResetPasswordForm from '../../../../src/components/organisms/Forms/ResetPasswordForm';
import { ResetPasswordValues } from '../../../../src/types/props/forms/ResetPasswordFormProps';

const MockForm: FC = () => {
    const formProps = useMockFormProps<ResetPasswordValues>({
        newPassword: '',
        newPasswordConfirm: '',
    });

    return <ResetPasswordForm {...formProps} />;
};

describe('ResetPasswordForm', () => {
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
