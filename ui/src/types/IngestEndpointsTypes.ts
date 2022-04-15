import { VarType } from '../gql/generated/globalTypes';
import { IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_default_value } from '../gql/generated/IngestEndpointEnvironmentInstructionsGetData';

export interface IngestEndpointDataMap {
    __typename: 'IngestEndpointDataMap';
    id: string;
    key: string;
    var_type: VarType;
    is_optional: boolean;
    default_value: IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_default_value | null;
    child_ingest_endpoint_data_maps: IngestEndpointDataMap[];
}

export interface IngestEndpointRevision {
    id: string;
    ingest_endpoint_data_maps: IngestEndpointDataMap[];
}

export interface IngestEndpointForEnvironmentSelection {
    id: string;
    name: string;
    ingest_endpoint_environments: IngestEndpointEnvironment[];
    [key: string]: any;
}

export type IngestEndpointEnvironment = {
    id: string;
    name: string;
    cname: string;
    install_domain: string;
    custom_domain: string | null;
    install_endpoint: string;
    ingest_endpoint_revision: IngestEndpointRevision;
    [key: string]: any;
};
