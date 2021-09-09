import { IngestEndpointForEnvironmentSelection } from '../../types/IngestEndpointsTypes';

const mockIngestEndpoints = {
    emptyIngestEndpointList: [] as IngestEndpointForEnvironmentSelection[],
    emptyIngestEndpoint: [
        {
            __typename: 'IngestEndpoint',
            id: '5edf4c48e9615d9a1c66bc3b',
            name: 'Test Endpoint',
            ingest_endpoint_environments: [],
        },
    ] as IngestEndpointForEnvironmentSelection[],
    defaultCase: [
        {
            __typename: 'IngestEndpoint',
            id: '5edf4c48e9615d9a1c66bc3b',
            name: 'Test Endpoint',
            ingest_endpoint_environments: [
                {
                    __typename: 'IngestEndpointEnvironment',
                    id: '5edf4c48e9615d9a1c66bc3d',
                    name: 'development',
                    cname: 'd5edf4c48e9615d9a1c66bc3d.scale8.com',
                    custom_domain: null,
                    install_domain: 'd5edf4c48e9615d9a1c66bc3d.scale8.com',
                    config_hint: 'Data Set: development',
                    storage_provider: 'GC_BIGQUERY_STREAM',
                    ingest_endpoint_revision: {
                        id: '5edf4c48e9615d9a1c66bc3c',
                        ingest_endpoint_data_maps: [
                            {
                                __typename: 'IngestEndpointDataMap',
                                child_ingest_endpoint_data_maps: [],
                                id: '5fd72001bf85900a1943080f',
                                key: 'a',
                                var_type: 'STRING',
                                is_optional: false,
                                default_value: null,
                            },
                            {
                                __typename: 'IngestEndpointDataMap',
                                child_ingest_endpoint_data_maps: [],
                                id: '5fd72001bf85900a19430810',
                                key: 'b',
                                var_type: 'INT',
                                is_optional: false,
                                default_value: null,
                            },
                        ],
                    },
                    minute_usage: [],
                    created_at: 1607933953912,
                    updated_at: 1607933953912,
                },
            ],
        },
    ] as IngestEndpointForEnvironmentSelection[],
};

export { mockIngestEndpoints };
