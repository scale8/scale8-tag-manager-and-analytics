import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import ActionForm from '../../../../src/components/organisms/Forms/ActionForm';
import { FC } from 'react';
import { useMockActionFormProps } from '../../../componentsMocks/useMockActionFormProps';

const MockForm: FC = () => {
    const formProps = useMockActionFormProps();

    return <ActionForm {...formProps} />;
};

describe('ActionForm', () => {
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
