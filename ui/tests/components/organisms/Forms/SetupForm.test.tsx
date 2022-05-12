import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import SetupForm from '../../../../src/components/organisms/Forms/SetupForm';
import { SetupValues } from '../../../../src/types/props/forms/SetupFormProps';

const MockForm: FC = () => {
    const formProps = useMockFormProps<SetupValues>({
        newPassword: '',
        newPasswordConfirm: '',
        email: '',
        orgName: '',
        firstName: '',
        lastName: '',
    });

    return <SetupForm {...formProps} />;
};

describe('SetupForm', () => {
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
