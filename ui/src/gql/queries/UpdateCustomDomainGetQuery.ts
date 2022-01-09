import { gql } from '@apollo/client';

const UpdateCustomDomainGetQuery = gql`
    query UpdateCustomDomainGetQueryData($id: ID!) {
        getEnvironment(id: $id) {
            id
            name
            url
            custom_domain
            install_domain
            revision {
                id
            }
        }
    }
`;

export default UpdateCustomDomainGetQuery;
