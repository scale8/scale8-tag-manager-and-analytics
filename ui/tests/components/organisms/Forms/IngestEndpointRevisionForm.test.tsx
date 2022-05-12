import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import IngestEndpointRevisionForm from '../../../../src/components/organisms/Forms/IngestEndpointRevisionForm';
import { IngestEndpointRevisionValues } from '../../../../src/dialogPages/dataManager/IngestEndpointRevisionUpdate';

const MockForm: FC = () => {
    const formProps = useMockFormProps<IngestEndpointRevisionValues>({
        name: '',
    });

    return <IngestEndpointRevisionForm {...formProps} />;
};

describe('IngestEndpointRevisionForm', () => {
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
