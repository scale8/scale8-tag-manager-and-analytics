import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import ActionGroupDistributionForm from '../../../../src/components/organisms/Forms/ActionGroupDistributionForm';
import { ActionGroupDistributionValues } from '../../../../src/types/props/forms/ActionGroupDistributionFormProps';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import { ActionGroupDistributionType } from '../../../../src/gql/generated/globalTypes';

const MockForm: FC = () => {
    const formProps = useMockFormProps<ActionGroupDistributionValues>({
        name: '',
        comments: '',
        type: ActionGroupDistributionType.NONE,
    });

    return <ActionGroupDistributionForm {...formProps} />;
};

describe('ActionGroupDistributionForm', () => {
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
