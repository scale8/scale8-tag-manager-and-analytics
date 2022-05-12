import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import RevisionPreviewForm from '../../../../src/components/organisms/Forms/RevisionPreviewForm';
import { RevisionPreviewValues } from '../../../../src/dialogPages/tagManager/app/AppRevisionPreview';

const MockForm: FC = () => {
    const formProps = useMockFormProps<RevisionPreviewValues>({
        url: '',
        environment: '',
    });

    return (
        <RevisionPreviewForm {...formProps} description="" environments={[{ name: '', url: '' }]} />
    );
};

describe('RevisionPreviewForm', () => {
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
