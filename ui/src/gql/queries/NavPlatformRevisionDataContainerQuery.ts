import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavPlatformRevisionDataContainerQuery = gql`
    query NavPlatformRevisionDataContainer($id: ID!) {
        getPlatformDataContainer(id: $id) {
            id
            name
            platform_revision {
                id
                name
                platform_data_containers {
                    id
                    name
                }
                platform {
                    id
                    name
                    tag_manager_account {
                        id
                        platforms {
                            id
                            name
                            type
                        }
                        org {
                            ...orgUserDetails
                        }
                    }
                    platform_revisions {
                        id
                        name
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

export default NavPlatformRevisionDataContainerQuery;
