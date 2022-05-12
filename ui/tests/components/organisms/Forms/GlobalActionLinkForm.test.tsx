import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import GlobalActionLinkForm from '../../../../src/components/organisms/Forms/GlobalActionLinkForm';
import { ActionGroupDistributionLinkValues } from '../../../../src/dialogPages/tagManager/app/action/ActionGroupDistributionLink';

const MockForm: FC = () => {
    const formProps = useMockFormProps<ActionGroupDistributionLinkValues>({
        globalActionGroupDistributionId: '',
    });

    return (
        <GlobalActionLinkForm {...formProps} availableGlobalActions={[{ key: 'p1', text: 'p1' }]} />
    );
};

describe('GlobalActionLinkForm', () => {
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
