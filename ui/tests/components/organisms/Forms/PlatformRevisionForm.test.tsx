import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import PlatformRevisionForm from '../../../../src/components/organisms/Forms/PlatformRevisionForm';
import { PlatformRevisionValues } from '../../../../src/dialogPages/tagManager/platform/PlatformRevisionUpdate';

const MockForm: FC = () => {
    const formProps = useMockFormProps<PlatformRevisionValues>({
        name: '',
        comments: '',
    });

    return <PlatformRevisionForm {...formProps} />;
};

describe('PlatformRevisionForm', () => {
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
