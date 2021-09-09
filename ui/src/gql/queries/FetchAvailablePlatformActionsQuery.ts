import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';
import { TrackerDatamapsFields } from '../fragments/TrackerDatamapsFields';

const FetchAvailablePlatformActionsQuery = gql`
    query FetchAvailablePlatformActions($id: ID!) {
        getActionGroupDistribution(id: $id) {
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
                        platform_actions {
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
                        }
                    }
                }
                app {
                    id
                    revisions {
                        id
                        name
                    }
                    environments {
                        id
                        name
                    }
                    tag_manager_account {
                        id
                        org {
                            id
                            data_manager_account {
                                id
                                ingest_endpoints {
                                    id
                                    name
                                    ingest_endpoint_environments {
                                        id
                                        name
                                        cname
                                        custom_domain
                                        install_domain
                                        config_hint
                                        storage_provider
                                        ingest_endpoint_revision {
                                            id
                                            ingest_endpoint_data_maps {
                                                ...trackerDatamapsFields
                                                child_ingest_endpoint_data_maps {
                                                    ...trackerDatamapsFields
                                                    child_ingest_endpoint_data_maps {
                                                        ...trackerDatamapsFields
                                                    }
                                                }
                                            }
                                        }
                                        created_at
                                        updated_at
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
    ${TrackerDatamapsFields}
`;

export default FetchAvailablePlatformActionsQuery;
