/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateIngestEndpointCustomDomainGetQueryData
// ====================================================

export interface UpdateIngestEndpointCustomDomainGetQueryData_getIngestEndpointEnvironment {
  __typename: "IngestEndpointEnvironment";
  /**
   * ID of the `IngestEndpointEnvironment`
   */
  id: string;
  /**
   * Name of the `IngestEndpointEnvironment`
   */
  name: string;
  /**
   * A custom domain name associated with this `IngestEndpointEnvironment`
   */
  custom_domain: string | null;
  /**
   * `IngestEndpointEnvironment`'s install domain used to push data to
   */
  install_domain: string;
}

export interface UpdateIngestEndpointCustomDomainGetQueryData {
  /**
   * @bound=IngestEndpointEnvironment
   * Get an `IngestEndpointEnvironment` model from `IngestEndpointEnvironment` ID
   */
  getIngestEndpointEnvironment: UpdateIngestEndpointCustomDomainGetQueryData_getIngestEndpointEnvironment;
}

export interface UpdateIngestEndpointCustomDomainGetQueryDataVariables {
  id: string;
}
