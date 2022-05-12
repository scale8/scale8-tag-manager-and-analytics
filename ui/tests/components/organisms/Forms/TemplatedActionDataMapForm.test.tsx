import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import TemplatedActionDataMapForm from '../../../../src/components/organisms/Forms/TemplatedActionDataMapForm';
import { TemplatedActionDataMapValues } from '../../../../src/utils/forms/TemplatedActionDataMapFormUtils';

const MockForm: FC = () => {
    const formProps = useMockFormProps<TemplatedActionDataMapValues>({
        key: '',
        type: '',
        description: '',
        defaultValue: '',
        defaultValues: [],
        optionValues: undefined,
        validationRules: undefined,
        optional: false,
        useDefault: true,
    });

    return <TemplatedActionDataMapForm isEdit={false} readOnly={false} {...formProps} />;
};

describe('TemplatedActionDataMapForm', () => {
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
