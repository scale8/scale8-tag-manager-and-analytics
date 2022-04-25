/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { StorageProvider } from "./globalTypes";

// ====================================================
// GraphQL query operation: NavIngestEndpointRevision
// ====================================================

export interface NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_ingest_endpoint_revisions {
  __typename: "IngestEndpointRevision";
  /**
   * ID of the `IngestEndpointRevision`
   */
  id: string;
  /**
   * Name of the `IngestEndpointRevision`
   */
  name: string;
}

export interface NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_data_manager_account_ingest_endpoints {
  __typename: "IngestEndpoint";
  /**
   * ID of the `IngestEndpoint`
   */
  id: string;
  /**
   * Name of the `IngestEndpoint`
   */
  name: string;
}

export interface NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_data_manager_account_org_tag_manager_account {
  __typename: "TagManagerAccount";
  id: string;
  /**
   * The amount of days until the trial expires
   */
  trial_expires_in: number;
  /**
   * If the account is in a trial period
   */
  is_trial: boolean;
  /**
   * If the account is enabled
   */
  enabled: boolean;
}

export interface NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_data_manager_account_org_data_manager_account {
  __typename: "DataManagerAccount";
  /**
   * `DataManagerAccount` ID
   */
  id: string;
  /**
   * The amount of days until the trial expires
   */
  trial_expires_in: number;
  /**
   * If the account is in a trial period
   */
  is_trial: boolean;
  /**
   * If the account is enabled
   */
  enabled: boolean;
}

export interface NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_data_manager_account_org_me_permissions {
  __typename: "OrgUserPermissions";
  /**
   * `Org` user is able to view the org entities
   */
  can_view: boolean;
  /**
   * `Org` user is able to create new entities
   */
  can_create: boolean;
  /**
   * `Org` user is able to edit entities
   */
  can_edit: boolean;
  /**
   * `Org` user is able to delete entities
   */
  can_delete: boolean;
  /**
   * `Org` user has admin level access
   */
  is_admin: boolean;
}

export interface NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_data_manager_account_org_me {
  __typename: "OrgUser";
  /**
   * `OrgUser` ID
   */
  id: string;
  /**
   * `OrgUser`'s permissions as described in `OrgUserPermissions`
   */
  permissions: NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_data_manager_account_org_me_permissions;
  /**
   * If the `OrgUser` currently has ownership of this `Org`. Ownership is required
   * to manage billing, upgrades, downgrades and termination of an Org.
   */
  owner: boolean;
}

export interface NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_data_manager_account_org {
  __typename: "Org";
  /**
   * A unique `Org` ID
   */
  id: string;
  /**
   * Name used to describe the `Org`
   */
  name: string;
  /**
   * A `TagManagerAccount` associated with this `Org`. A Scale8 Tag Manager account
   * might not exist yet unless a trial has been requested or product has been subscribed to.
   */
  tag_manager_account: NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_data_manager_account_org_tag_manager_account;
  /**
   * A `DataManagerAccount` associated with this `Org`. A Scale8 Data Manager
   * account might not exist yet unless a trial has been requested or product has
   * been subscribed to.
   */
  data_manager_account: NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_data_manager_account_org_data_manager_account;
  /**
   * `OrgUser` representation of current `User`
   */
  me: NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_data_manager_account_org_me;
}

export interface NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_data_manager_account {
  __typename: "DataManagerAccount";
  /**
   * `DataManagerAccount` ID
   */
  id: string;
  /**
   * A list of `IngestEndpoint`s linked to the `DataManagerAccount`
   */
  ingest_endpoints: NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_data_manager_account_ingest_endpoints[];
  /**
   * `Org` that owns this `DataManagerAccount`
   */
  org: NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_data_manager_account_org;
  /**
   * If the account is enabled
   */
  enabled: boolean;
}

export interface NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint {
  __typename: "IngestEndpoint";
  /**
   * ID of the `IngestEndpoint`
   */
  id: string;
  /**
   * Name of the `IngestEndpoint`
   */
  name: string;
  /**
   * Whether the analytics on the `IngestEndpoint` is enabled
   */
  analytics_enabled: boolean;
  /**
   * The storage provider used by the `IngestEndpoint` to track data
   */
  storage_provider: StorageProvider;
  /**
   * The `IngestEndpointRevision`s connected to the `IngestEndpoint`
   */
  ingest_endpoint_revisions: NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_ingest_endpoint_revisions[];
  /**
   * The `DataManagerAccount` that contains the `IngestEndpoint`
   */
  data_manager_account: NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint_data_manager_account;
}

export interface NavIngestEndpointRevision_getIngestEndpointRevision {
  __typename: "IngestEndpointRevision";
  /**
   * ID of the `IngestEndpointRevision`
   */
  id: string;
  /**
   * Name of the `IngestEndpointRevision`
   */
  name: string;
  /**
   * The `IngestEndpoint` that the `IngestEndpointRevision` belongs to
   */
  ingest_endpoint: NavIngestEndpointRevision_getIngestEndpointRevision_ingest_endpoint;
}

export interface NavIngestEndpointRevision_me_orgs {
  __typename: "Org";
  /**
   * A unique `Org` ID
   */
  id: string;
  /**
   * Name used to describe the `Org`
   */
  name: string;
}

export interface NavIngestEndpointRevision_me {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
  /**
   * List of `Org`s the `User` has access to
   */
  orgs: NavIngestEndpointRevision_me_orgs[];
}

export interface NavIngestEndpointRevision {
  /**
   * @bound=IngestEndpointRevision
   * Get a `IngestEndpointRevision` by it's ID
   */
  getIngestEndpointRevision: NavIngestEndpointRevision_getIngestEndpointRevision;
  /**
   * @bound=User
   * Get a the session user
   */
  me: NavIngestEndpointRevision_me;
}

export interface NavIngestEndpointRevisionVariables {
  id: string;
}
