import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import GithubPreparationForm from '../../../../src/components/organisms/Forms/GithubPreparationForm';
import { GitHubPreparationValues } from '../../../../src/dialogPages/global/GithubAccount';

const MockForm: FC = () => {
    const formProps = useMockFormProps<GitHubPreparationValues>({
        githubUser: '',
    });

    return <GithubPreparationForm {...formProps} ssoError="" />;
};

describe('GithubPreparationForm', () => {
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
