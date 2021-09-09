import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavIngestEndpointQuery = gql`
    query NavIngestEndpoint($id: ID!) {
        getIngestEndpoint(id: $id) {
            id
            name
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
