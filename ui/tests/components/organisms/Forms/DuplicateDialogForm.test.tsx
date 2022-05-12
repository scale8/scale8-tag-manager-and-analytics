import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import DuplicateDialogForm from '../../../../src/components/organisms/Forms/DuplicateDialogForm';
import { DuplicateValues } from '../../../../src/utils/forms/DuplicateDialogFormUtils';

const MockForm: FC = () => {
    const formProps = useMockFormProps<DuplicateValues>({
        name: '',
    });

    return (
        <DuplicateDialogForm
            {...formProps}
            oldName=""
            handleDialogClose={() => {
                /*Idle*/
            }}
            description=""
        />
    );
};

describe('DuplicateDialogForm', () => {
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
