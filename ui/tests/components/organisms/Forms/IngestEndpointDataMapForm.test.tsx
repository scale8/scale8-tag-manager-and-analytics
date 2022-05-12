import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import IngestEndpointDataMapForm from '../../../../src/components/organisms/Forms/IngestEndpointDataMapForm';
import { IngestEndpointDataMapValues } from '../../../../src/dialogPages/dataManager/IngestEndpointDataMapCreate';

const MockForm: FC = () => {
    const formProps = useMockFormProps<IngestEndpointDataMapValues>({
        key: '',
        varType: '',
        defaultValue: '',
        defaultValues: [],
        optional: false,
        useDefault: false,
        validationRules: undefined,
    });

    return (
        <IngestEndpointDataMapForm {...formProps} lastLevel={false} edit={false} readOnly={false} />
    );
};

describe('IngestEndpointDataMapForm', () => {
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
