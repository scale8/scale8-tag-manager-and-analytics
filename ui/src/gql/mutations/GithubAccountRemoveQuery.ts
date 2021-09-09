import { gql } from '@apollo/client';

const GithubAccountRemoveQuery = gql`
    mutation GithubAccountRemoveValues {
        removeGitHubLink
    }
`;

export default GithubAccountRemoveQuery;
