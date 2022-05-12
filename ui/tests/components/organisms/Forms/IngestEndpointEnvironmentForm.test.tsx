import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import IngestEndpointEnvironmentForm from '../../../../src/components/organisms/Forms/IngestEndpointEnvironmentForm';
import { IngestEndpointEnvironmentValues } from '../../../../src/dialogPages/dataManager/IngestEndpointEnvironmentCreate';

const MockForm: FC = () => {
    const formProps = useMockFormProps<IngestEndpointEnvironmentValues>({
        name: '',
        revisionId: '',
        certificate: '',
        key: '',
        storageProvider: 'AWS_KINESIS',
        region: '',
    });

    return (
        <IngestEndpointEnvironmentForm
            {...formProps}
            isCreate={true}
            availableRevisions={[{ key: 'p1', text: 'p1' }]}
        />
    );
};

describe('IngestEndpointEnvironmentForm', () => {
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
