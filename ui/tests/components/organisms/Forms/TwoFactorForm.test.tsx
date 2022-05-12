import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import TwoFactorForm from '../../../../src/components/organisms/Forms/TwoFactorForm';
import { TwoFactorFormProps } from '../../../../src/dialogPages/global/TwoFactor';

const MockForm: FC = () => {
    const formProps: TwoFactorFormProps = {
        contextId: '',
        id: '',
        ids: [],
        readOnly: false,
        twoFactorEnabled: false,
        handleDialogClose: () => {
            //idle
        },
        pageRefresh: () => {
            //idle
        },
        setPageHasChanges: () => {
            //idle
        },
        toggleTwoFactorAction: () => {
            //idle
        },
    };

    return <TwoFactorForm {...formProps} />;
};

describe('TwoFactorForm', () => {
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
