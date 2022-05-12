import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import NotificationSettingsForm from '../../../../src/components/organisms/Forms/NotificationSettingsForm';
import { NotificationsSettingsValues } from '../../../../src/dialogPages/global/NotificationsSettings';

const MockForm: FC = () => {
    const formProps = useMockFormProps<NotificationsSettingsValues>({
        emailNotifications: false,
    });

    return <NotificationSettingsForm {...formProps} />;
};

describe('NotificationSettingsForm', () => {
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
