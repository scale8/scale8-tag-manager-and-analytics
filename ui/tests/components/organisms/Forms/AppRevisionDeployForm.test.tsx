import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import AppRevisionDeployForm from '../../../../src/components/organisms/Forms/AppRevisionDeployForm';
import { AppRevisionDeployValues } from '../../../../src/utils/forms/AppRevisionDeployDialogFormUtils';

const MockForm: FC = () => {
    const formProps = useMockFormProps<AppRevisionDeployValues>({
        environmentId: '',
    });

    return <AppRevisionDeployForm {...formProps} availableEnvironments={[]} />;
};

describe('AppRevisionDeployForm', () => {
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
