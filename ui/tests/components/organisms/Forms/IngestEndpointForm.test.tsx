import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import IngestEndpointForm from '../../../../src/components/organisms/Forms/IngestEndpointForm';
import { IngestEndpointValues } from '../../../../src/utils/forms/IngestEndpointFormUtils';

const MockForm: FC = () => {
    const formProps = useMockFormProps<IngestEndpointValues>({
        name: '',
        wizard: '',
        analyticsEnabled: true,
        storageProvider: 'AWS_KINESIS',
        region: '',
    });

    return <IngestEndpointForm {...formProps} isCreate={true} />;
};

describe('IngestEndpointForm', () => {
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
