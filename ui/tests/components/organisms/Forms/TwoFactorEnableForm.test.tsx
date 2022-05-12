import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import TwoFactorEnableForm from '../../../../src/components/organisms/Forms/TwoFactorEnableForm';
import { TwoFactorEnableValues } from '../../../../src/dialogPages/global/TwoFactorEnable';

const MockForm: FC = () => {
    const formProps = useMockFormProps<TwoFactorEnableValues>({
        code: '',
    });

    return <TwoFactorEnableForm secret={''} email={''} {...formProps} />;
};

describe('TwoFactorEnableForm', () => {
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
