import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';

const UpdateTemplatedActionGetQuery = gql`
    query UpdateTemplatedActionGetData($id: ID!) {
        getPlatformAction(id: $id) {
            id
            name
            description
            icon
            code
            exec_raw_in_iframe
            platform_data_maps {
                ...platformDatamapsFields
                child_platform_data_maps {
                    ...platformDatamapsFields
                    child_platform_data_maps {
                        ...platformDatamapsFields
                    }
                }
            }
            permissions_requests {
                id
                permission
                variable_read_write_execute_scopes {
                    name
                    read
                    write
                    execute
                }
                url_parts
                host_matches
                event_names
            }
        }
    }
    ${PlatformDatamapsFields}
`;

export default UpdateTemplatedActionGetQuery;
