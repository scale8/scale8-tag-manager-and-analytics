import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavIngestEndpointQuery = gql`
    query NavIngestEndpoint($id: ID!) {
        getIngestEndpoint(id: $id) {
            id
            name
            analytics_enabled
            storage_provider
            data_manager_account {
                id
                ingest_endpoints {
                    id
                    name
                }
                org {
                    ...orgUserDetails
                }
            }
        }
        me {
            ...userOrgList
        }
    }
    ${OrgUserDetails}
    ${UserOrgList}
`;

export default NavIngestEndpointQuery;
