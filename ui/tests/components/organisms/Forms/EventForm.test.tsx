import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import {
    platformDataFormResultProps,
    useMockFormProps,
} from '../../../componentsMocks/useMockFormProps';
import EventForm from '../../../../src/components/organisms/Forms/EventForm';
import { EventValues } from '../../../../src/dialogPages/tagManager/app/trigger/EventCreate';

const MockForm: FC = () => {
    const formProps = useMockFormProps<EventValues>({
        eventId: '',
        browserEvent: '',
        comments: '',
        name: '',
        clearState: 0,
    });

    return (
        <EventForm
            {...formProps}
            {...platformDataFormResultProps}
            availableEvents={[{ key: 'p1', text: 'p1' }]}
            consentPurposes={[]}
            consentVendors={[]}
        />
    );
};

describe('EventForm', () => {
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
