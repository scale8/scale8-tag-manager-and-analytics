import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import OrgUserInviteForm from '../../../../src/components/organisms/Forms/OrgUserInviteForm';
import { OrgUserInviteValues } from '../../../../src/dialogPages/global/OrgUserInvite';

const MockForm: FC = () => {
    const formProps = useMockFormProps<OrgUserInviteValues>({
        email: '',
        permissionsCanCreate: false,
        permissionsCanDelete: false,
        permissionsCanEdit: false,
        permissionsCanView: true,
        permissionsIsAdmin: false,
    });

    return <OrgUserInviteForm {...formProps} />;
};

describe('OrgUserInviteForm', () => {
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
