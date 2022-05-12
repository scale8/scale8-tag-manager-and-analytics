import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import PersonalInfoForm from '../../../../src/components/organisms/Forms/PersonalInfoForm';
import { PersonalInfoValues } from '../../../../src/dialogPages/global/PersonalInfoUpdate';

const MockForm: FC = () => {
    const formProps = useMockFormProps<PersonalInfoValues>({
        firstName: '',
        lastName: '',
    });

    return <PersonalInfoForm {...formProps} />;
};

describe('PersonalInfoForm', () => {
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
