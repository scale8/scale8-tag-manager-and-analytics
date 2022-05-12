import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import CustomDomainForm from '../../../../src/components/organisms/Forms/CustomDomainForm';
import { CustomDomainValues } from '../../../../src/utils/forms/CustomDomainFormUtils';

const MockForm: FC = () => {
    const formProps = useMockFormProps<CustomDomainValues>({
        domain: '',
        certificate: '',
        key: '',
    });

    return <CustomDomainForm {...formProps} cname="" />;
};

describe('CustomDomainForm', () => {
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
