import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import AppPlatformForm from '../../../../src/components/organisms/Forms/AppPlatformForm';
import { AppPlatformValues } from '../../../../src/dialogPages/tagManager/app/InstallAppPlatform';

const MockForm: FC = () => {
    const formProps = useMockFormProps<AppPlatformValues>({
        platformId: '',
    });

    return <AppPlatformForm {...formProps} availableAppPlatforms={[{ key: 'p1', text: 'p1' }]} />;
};

describe('AppPlatformForm', () => {
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
