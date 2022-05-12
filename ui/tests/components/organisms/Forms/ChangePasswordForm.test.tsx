import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import ChangePasswordForm from '../../../../src/components/organisms/Forms/ChangePasswordForm';
import { ChangePasswordValues } from '../../../../src/dialogPages/global/ChangePassword';

const MockForm: FC = () => {
    const formProps = useMockFormProps<ChangePasswordValues>({
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
    });

    return <ChangePasswordForm {...formProps} hasLinkedSSO={false} email="" />;
};

describe('ChangePasswordForm', () => {
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
