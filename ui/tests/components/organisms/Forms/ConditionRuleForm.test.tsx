import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import ConditionRuleForm from '../../../../src/components/organisms/Forms/ConditionRuleForm';
import { useMockConditionFormProps } from '../../../componentsMocks/useMockConditionFormProps';

const MockForm: FC = () => {
    const formProps = useMockConditionFormProps();

    return <ConditionRuleForm {...formProps} />;
};

describe('ConditionRuleForm', () => {
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
