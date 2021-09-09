import { gql } from '@apollo/client';

const PageGlobalTriggerContentQuery = gql`
    query GlobalTriggerPageData($id: ID!) {
        getTrigger(id: $id) {
            id
            name
            parent_type
            revision {
                id
                locked
            }
            events {
                id
                name
                event {
                    __typename
                    ... on CustomEvent {
                        custom_name
                    }
                    ... on PlatformEvent {
                        id
                        platform {
                            id
                            name
                        }
                    }
                }
            }
            condition_rules {
                id
                name
                platform_data_container {
                    id
                    name
                    icon
                    platform {
                        id
                        name
                    }
                }
            }
            exception_rules {
                id
                name
                platform_data_container {
                    id
                    name
                    icon
                    platform {
                        id
                        name
                    }
                }
            }
        }
    }
`;

export default PageGlobalTriggerContentQuery;
