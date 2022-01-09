import { gql } from '@apollo/client';

const UpdateIngestEndpointCustomDomainGetQuery = gql`
    query UpdateIngestEndpointCustomDomainGetQueryData($id: ID!) {
        getIngestEndpointEnvironment(id: $id) {
            id
            name
            custom_domain
            cname
        }
    }
`;

export default UpdateIngestEndpointCustomDomainGetQuery;
