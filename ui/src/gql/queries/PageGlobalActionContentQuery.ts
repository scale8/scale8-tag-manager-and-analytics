import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';

const PageGlobalActionContentQuery = gql`
    query GlobalActionPageData($id: ID!) {
        getActionGroupDistribution(id: $id) {
            id
            name
            parent_type
            action_group_distribution_type
            revision {
                id
                locked
            }
            action_groups {
                id
                name
                actions {
                    id
                    name
                    platform_action {
                        id
                        name
                        description
                        icon
                        platform_data_maps {
                            ...platformDatamapsFields
                            child_platform_data_maps {
                                ...platformDatamapsFields
                                child_platform_data_maps {
                                    ...platformDatamapsFields
                                }
                            }
                        }
                        platform {
                            id
                            name
                        }
                    }
                }
                distribution
                is_locked
            }
        }
    }
    ${PlatformDatamapsFields}
`;

export default PageGlobalActionContentQuery;
