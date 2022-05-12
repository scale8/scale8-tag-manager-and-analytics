import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import OrgUserAddForm from '../../../../src/components/organisms/Forms/OrgUserAddForm';
import { OrgUserAddValues } from '../../../../src/dialogPages/global/OrgUserAdd';

const MockForm: FC = () => {
    const formProps = useMockFormProps<OrgUserAddValues>({
        firstName: '',
        lastName: '',
        email: '',
        permissionsCanCreate: false,
        permissionsCanDelete: false,
        permissionsCanEdit: false,
        permissionsCanView: true,
        permissionsIsAdmin: false,
    });

    return <OrgUserAddForm {...formProps} />;
};

describe('OrgUserAddForm', () => {
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
