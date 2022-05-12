import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import OrgTransferOwnershipForm from '../../../../src/components/organisms/Forms/OrgTransferOwnershipForm';
import { OrgTransferOwnershipValues } from '../../../../src/types/props/forms/OrgTransferOwnershipFormProps';

const MockForm: FC = () => {
    const formProps = useMockFormProps<OrgTransferOwnershipValues>({
        userId: '',
    });

    return <OrgTransferOwnershipForm {...formProps} viableUsers={[{ key: 'p1', text: 'p1' }]} />;
};

describe('OrgTransferOwnershipForm', () => {
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
