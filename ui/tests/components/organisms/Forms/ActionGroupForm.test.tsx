import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import ActionGroupForm from '../../../../src/components/organisms/Forms/ActionGroupForm';
import { ActionGroupValues } from '../../../../src/dialogPages/tagManager/app/action/ActionGroupCreate';

const MockForm: FC = () => {
    const formProps = useMockFormProps<ActionGroupValues>({
        name: '',
        comments: '',
    });

    return <ActionGroupForm {...formProps} />;
};

describe('ActionGroupForm', () => {
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
