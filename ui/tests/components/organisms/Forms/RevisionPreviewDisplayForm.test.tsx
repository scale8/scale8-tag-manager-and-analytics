import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import RevisionPreviewDisplayForm, {
    RevisionPreviewDisplayFormProps,
} from '../../../../src/components/organisms/Forms/RevisionPreviewDisplayForm';

const MockForm: FC = () => {
    const formProps: RevisionPreviewDisplayFormProps = {
        submitText: 'submit',
        url: '',
        revisionName: '',
        handleSubmit: () => {
            //idle
        },
        handleDialogClose: () => {
            //idle
        },
    };

    return <RevisionPreviewDisplayForm {...formProps} />;
};

describe('RevisionPreviewDisplayForm', () => {
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
