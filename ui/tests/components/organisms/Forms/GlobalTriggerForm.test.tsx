import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import GlobalTriggerForm from '../../../../src/components/organisms/Forms/GlobalTriggerForm';
import { TriggerValues } from '../../../../src/dialogPages/tagManager/app/trigger/GlobalTriggerCreate';

const MockForm: FC = () => {
    const formProps = useMockFormProps<TriggerValues>({
        name: '',
        comments: '',
    });

    return <GlobalTriggerForm {...formProps} />;
};

describe('GlobalTriggerForm', () => {
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
