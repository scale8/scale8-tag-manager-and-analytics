import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import AppPlatformRevisionPreviewForm from '../../../../src/components/organisms/Forms/AppPlatformRevisionPreviewForm';
import { AppPlatformRevisionValues } from '../../../../src/dialogPages/tagManager/app/LinkPlatformRevision';

const MockForm: FC = () => {
    const formProps = useMockFormProps<AppPlatformRevisionValues>({
        platformRevisionId: '',
    });

    return <AppPlatformRevisionPreviewForm {...formProps} revisionName="" groups={[]} />;
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
