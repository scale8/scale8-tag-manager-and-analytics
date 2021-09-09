import { gql } from '@apollo/client';

const PreviewFrameQuery = gql`
    query PreviewFrameData($revisionId: ID!, $appId: ID!) {
        getApp(id: $appId) {
            id
            name
        }
        getRevision(id: $revisionId) {
            id
            name
            locked
            tags {
                id
                name
                tag_code
                type
                rule_groups {
                    id
                    name
                    is_active
                    rules {
                        id
                        name
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
                height
                width
            }
        }
    }
`;

export default PreviewFrameQuery;
