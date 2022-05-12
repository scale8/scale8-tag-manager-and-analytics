import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import OrgForm from '../../../../src/components/organisms/Forms/OrgForm';
import { OrgValues } from '../../../../src/dialogPages/global/OrgCreate';

const MockForm: FC = () => {
    const formProps = useMockFormProps<OrgValues>({
        name: '',
    });

    return <OrgForm {...formProps} />;
};

describe('OrgForm', () => {
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
