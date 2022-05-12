import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import TwoFactorLoginForm from '../../../../src/components/organisms/Forms/TwoFactorLoginForm';
import { TwoFactorLoginValues } from '../../../../src/types/props/forms/LoginFormProps';

const MockForm: FC = () => {
    const formProps = useMockFormProps<TwoFactorLoginValues>({
        code: '',
    });

    return <TwoFactorLoginForm {...formProps} />;
};

describe('TwoFactorLoginForm', () => {
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
