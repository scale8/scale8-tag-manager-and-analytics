import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import ChangeEmailForm from '../../../../src/components/organisms/Forms/ChangeEmailForm';
import { ChangeEmailValues } from '../../../../src/dialogPages/global/ChangeEmail';

const MockForm: FC = () => {
    const formProps = useMockFormProps<ChangeEmailValues>({
        email: '',
        confirmEmail: '',
    });

    return <ChangeEmailForm {...formProps} />;
};

describe('ChangeEmailForm', () => {
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
