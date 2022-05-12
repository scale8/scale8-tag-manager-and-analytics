import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import OrgUserUpdateForm from '../../../../src/components/organisms/Forms/OrgUserUpdateForm';
import { PermissionsValues } from '../../../../src/utils/PermissionsUtils';

const MockForm: FC = () => {
    const formProps = useMockFormProps<PermissionsValues>({
        permissionsCanCreate: false,
        permissionsCanDelete: false,
        permissionsCanEdit: false,
        permissionsCanView: true,
        permissionsIsAdmin: false,
    });

    return <OrgUserUpdateForm {...formProps} />;
};

describe('OrgUserUpdateForm', () => {
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
