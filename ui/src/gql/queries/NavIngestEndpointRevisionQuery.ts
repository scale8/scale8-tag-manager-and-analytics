import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavIngestEndpointRevisionQuery = gql`
    query NavIngestEndpointRevision($id: ID!) {
        getIngestEndpointRevision(id: $id) {
            id
            name
            ingest_endpoint {
                id
                name
                analytics_enabled
                storage_provider
                ingest_endpoint_revisions {
                    id
                    name
                }
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
        }
        me {
            ...userOrgList
        }
    }
    ${OrgUserDetails}
    ${UserOrgList}
`;

export default NavIngestEndpointRevisionQuery;
