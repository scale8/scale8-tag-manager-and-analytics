import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import RuleGroupForm from '../../../../src/components/organisms/Forms/RuleGroupForm';
import { RuleGroupValues } from '../../../../src/dialogPages/tagManager/app/tag/RuleGroupCreate';

const MockForm: FC = () => {
    const formProps = useMockFormProps<RuleGroupValues>({
        name: '',
        comments: '',
    });

    return <RuleGroupForm {...formProps} />;
};

describe('RuleGroupForm', () => {
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
