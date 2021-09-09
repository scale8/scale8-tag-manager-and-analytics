import { gql } from '@apollo/client';

const CreateIngestEndpointDataMapChildQuery = gql`
    mutation CreateIngestEndpointDataMapChild(
        $addChildrenIngestEndpointDataMapsInput: AddChildrenIngestEndpointDataMapsInput!
    ) {
        addChildrenIngestEndpointDataMaps(
            addChildrenIngestEndpointDataMapsInput: $addChildrenIngestEndpointDataMapsInput
        ) {
            id
        }
    }
`;

export default CreateIngestEndpointDataMapChildQuery;
