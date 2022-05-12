import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import EnvironmentForm from '../../../../src/components/organisms/Forms/EnvironmentForm';
import { EnvironmentValues } from '../../../../src/utils/forms/EnvironmentFormUtils';

const MockForm: FC = () => {
    const formProps = useMockFormProps<EnvironmentValues>({
        name: '',
        url: '',
        revisionId: '',
        comments: '',
    });

    return <EnvironmentForm {...formProps} availableRevisions={[{ key: 'p1', text: 'p1' }]} />;
};

describe('EnvironmentForm', () => {
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
