import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import AppRevisionForm from '../../../../src/components/organisms/Forms/AppRevisionForm';
import { AppRevisionValues } from '../../../../src/dialogPages/tagManager/app/AppRevisionUpdate';

const MockForm: FC = () => {
    const formProps = useMockFormProps<AppRevisionValues>({
        name: '',
        comments: '',
    });

    return <AppRevisionForm {...formProps} />;
};

describe('AppRevisionForm', () => {
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
