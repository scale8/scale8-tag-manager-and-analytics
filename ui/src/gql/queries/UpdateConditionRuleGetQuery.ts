import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';

const UpdateConditionRuleGetQuery = gql`
    query UpdateConditionRuleGetData($conditionId: ID!, $triggerId: ID!) {
        getConditionRule(id: $conditionId) {
            id
            name
            match {
                __typename
                ... on CustomMatch {
                    custom_key
                }
                ... on PlatformDataMap {
                    id
                }
            }
            match_condition
            match_value
            match_key
            platform_data_container {
                id
                platform {
                    id
                }
            }
        }
        getTrigger(id: $triggerId) {
            id
            revision {
                id
                app_platform_revisions {
                    id
                    platform_revision {
                        id
                        platform {
                            id
                            name
                        }
                        platform_data_containers {
                            id
                            persisting_id
                            allow_custom
                            name
                            icon
                            description
                            platform_data_maps {
                                ...platformDatamapsFields
                                child_platform_data_maps {
                                    ...platformDatamapsFields
                                    child_platform_data_maps {
                                        ...platformDatamapsFields
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    ${PlatformDatamapsFields}
`;

export default UpdateConditionRuleGetQuery;
