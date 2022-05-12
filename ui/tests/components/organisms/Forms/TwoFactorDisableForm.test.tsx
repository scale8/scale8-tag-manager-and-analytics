import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import TwoFactorDisableForm from '../../../../src/components/organisms/Forms/TwoFactorDisableForm';
import { TwoFactorDisableValues } from '../../../../src/dialogPages/global/TwoFactorDisable';

const MockForm: FC = () => {
    const formProps = useMockFormProps<TwoFactorDisableValues>({
        code: '',
    });

    return <TwoFactorDisableForm {...formProps} />;
};

describe('TwoFactorDisableForm', () => {
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
