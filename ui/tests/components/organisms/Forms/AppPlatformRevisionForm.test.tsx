import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import {
    platformDataFormResultProps,
    useMockFormProps,
} from '../../../componentsMocks/useMockFormProps';
import AppPlatformRevisionForm from '../../../../src/components/organisms/Forms/AppPlatformRevisionForm';
import { AppPlatformRevisionValues } from '../../../../src/dialogPages/tagManager/app/LinkPlatformRevision';

const MockForm: FC = () => {
    const formProps = useMockFormProps<AppPlatformRevisionValues>({
        platformRevisionId: '',
    });

    return (
        <AppPlatformRevisionForm
            {...formProps}
            {...platformDataFormResultProps}
            availableAppPlatformRevisions={[{ key: 'p1', text: 'p1' }]}
            isEdit={false}
            initialId=""
        />
    );
};

describe('AppPlatformRevisionForm', () => {
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
