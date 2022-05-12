import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import RequestPasswordResetForm from '../../../../src/components/organisms/Forms/RequestPasswordResetForm';
import { RequestPasswordResetValues } from '../../../../src/types/props/forms/PasswordResetFormProps';

const MockForm: FC = () => {
    const formProps = useMockFormProps<RequestPasswordResetValues>({
        email: '',
    });

    return <RequestPasswordResetForm {...formProps} fixedEmail={false} />;
};

describe('RequestPasswordResetForm', () => {
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
