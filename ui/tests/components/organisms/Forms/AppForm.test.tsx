import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import AppForm from '../../../../src/components/organisms/Forms/AppForm';
import { AppValues } from '../../../../src/dialogPages/tagManager/app/AppCreate';
import { AppType } from '../../../../src/gql/generated/globalTypes';

const MockForm: FC = () => {
    const formProps = useMockFormProps<AppValues>({
        name: '',
        domain: '',
        type: AppType.WEB,
        analyticsEnabled: true,
        errorTrackingEnabled: true,
        storageProvider: 'AWS_KINESIS',
        region: '',
    });

    return <AppForm {...formProps} isCreate={true} />;
};

describe('AppForm', () => {
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
