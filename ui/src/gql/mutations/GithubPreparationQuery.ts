import { gql } from '@apollo/client';

const GithubPreparationQuery = gql`
    mutation GithubPreparationValues($prepareGitHubLinkInput: PrepareGitHubLinkInput!) {
        prepareGitHubLink(prepareGitHubLinkInput: $prepareGitHubLinkInput) {
            id
        }
    }
`;

export default GithubPreparationQuery;
