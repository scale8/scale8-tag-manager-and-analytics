import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import TemplatedActionForm from '../../../../src/components/organisms/Forms/TemplatedActionForm';
import { TemplatedActionsValues } from '../../../../src/utils/forms/TemplatedActionFormUtils';

const MockForm: FC = () => {
    const formProps = useMockFormProps<TemplatedActionsValues>({
        name: '',
        description: '',
        icon: '',
        code: '',
        execRaw: false,
        platformDataMaps: [],
        permissionRequests: [],
    });

    return (
        <TemplatedActionForm readOnly={false} isEdit={false} userIsAdmin={true} {...formProps} />
    );
};

describe('TemplatedActionForm', () => {
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
