import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import APITokenForm from '../../../../src/components/organisms/Forms/APITokenForm';
import { APITokenFormProps } from '../../../../src/dialogPages/global/APIToken';

jest.mock('../../../../src/components/atoms/CopyBlock', () => {
    return () => null;
});

const MockForm: FC = () => {
    const formProps: APITokenFormProps = {
        token: '',
        uid: '',
        handleSubmit: () => {
            //idle
        },
        handleDialogClose: () => {
            //idle
        },
    };

    return <APITokenForm {...formProps} />;
};

describe('APITokenForm', () => {
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
