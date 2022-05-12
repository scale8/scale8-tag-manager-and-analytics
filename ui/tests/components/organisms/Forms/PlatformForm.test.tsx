import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import PlatformForm from '../../../../src/components/organisms/Forms/PlatformForm';
import { PlatformValues } from '../../../../src/utils/forms/PlatformFormUtils';
import { PlatformType } from '../../../../src/gql/generated/globalTypes';

const MockForm: FC = () => {
    const formProps = useMockFormProps<PlatformValues>({
        name: '',
        description: '',
        fileName: '',
        type: PlatformType.TEMPLATED,
    });

    return (
        <PlatformForm
            {...formProps}
            removeImage={() => {
                /*Idle*/
            }}
            handleImageUpload={() => {
                /*Idle*/
            }}
        />
    );
};

describe('PlatformForm', () => {
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
