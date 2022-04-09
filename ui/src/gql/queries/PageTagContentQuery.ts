import { gql } from '@apollo/client';

const PageTagContentQuery = gql`
    query TagContentPageData($id: ID!) {
        getTag(id: $id) {
            id
            revision {
                id
                locked
            }
            rule_groups {
                id
                name
                is_active
                rules {
                    id
                    name
                    min_repeat_interval
                    trigger {
                        id
                        name
                        parent_type
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
                                    icon
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
                                icon
                                name
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
                                icon
                                name
                                platform {
                                    id
                                    name
                                }
                            }
                        }
                    }
                    action_groups_distributions {
                        id
                        name
                        parent_type
                        action_group_distribution_type
                        action_groups {
                            id
                            name
                            actions {
                                id
                                name
                                platform_action {
                                    id
                                    icon
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
                    is_active
                }
            }
        }
    }
`;

export default PageTagContentQuery;
