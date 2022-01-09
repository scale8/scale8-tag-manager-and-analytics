import { gql } from '@apollo/client';

const UpdateCustomDomainGetQuery = gql`
    query UpdateCustomDomainGetQueryData($id: ID!) {
        getEnvironment(id: $id) {
            id
            name
            url
            custom_domain
            cname
        }
    }
`;

export default UpdateCustomDomainGetQuery;
