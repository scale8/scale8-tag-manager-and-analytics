import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import RuleForm from '../../../../src/components/organisms/Forms/RuleForm';
import { RuleValues } from '../../../../src/dialogPages/tagManager/app/tag/RuleCreate';

const MockForm: FC = () => {
    const formProps = useMockFormProps<RuleValues>({
        name: '',
        globalTriggerId: '',
        minRepeatInterval: 0,
        comments: '',
    });

    return <RuleForm {...formProps} />;
};

describe('RuleForm', () => {
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
