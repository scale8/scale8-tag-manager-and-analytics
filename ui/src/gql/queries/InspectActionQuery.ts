import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';
import { DatamapsFields } from '../fragments/DatamapsFields';
import { TrackerDatamapsFields } from '../fragments/TrackerDatamapsFields';

const InspectActionQuery = gql`
    query InspectActionData($id: ID!, $agdId: ID!) {
        getAction(id: $id) {
            name
            platform_action {
                id
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
            data_maps {
                ...datamapsFields
            }
        }
        getActionGroupDistribution(id: $agdId) {
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
                                        install_endpoint
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
    ${DatamapsFields}
    ${PlatformDatamapsFields}
    ${TrackerDatamapsFields}
`;

export default InspectActionQuery;
