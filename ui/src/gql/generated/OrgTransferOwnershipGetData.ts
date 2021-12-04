/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OrgTransferOwnershipGetData
// ====================================================

export interface OrgTransferOwnershipGetData_getOrg_users_permissions {
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

export interface OrgTransferOwnershipGetData_getOrg_users {
  __typename: "OrgUser";
  /**
   * `OrgUser` ID
   */
  id: string;
  /**
   * `OrgUser`'s first name
   */
  first_name: string;
  /**
   * `OrgUser`'s last name
   */
  last_name: string;
  /**
   * `OrgUser`'s email address
   */
  email: string;
  /**
   * `OrgUser`'s permissions as described in `OrgUserPermissions`
   */
  permissions: OrgTransferOwnershipGetData_getOrg_users_permissions;
  /**
   * If the `OrgUser` currently has ownership of this `Org`. Ownership is required
   * to manage billing, upgrades, downgrades and termination of an Org.
   */
  owner: boolean;
}

export interface OrgTransferOwnershipGetData_getOrg {
  __typename: "Org";
  /**
   * A unique `Org` ID
   */
  id: string;
  /**
   * List of `OrgUser`'s associated with this `Org`
   */
  users: OrgTransferOwnershipGetData_getOrg_users[];
}

export interface OrgTransferOwnershipGetData {
  /**
   * @bound=Org
   * Given a valid `Org` ID, this function will return an `Org` provided the API
   * `User` has been granted at least **view** access.
   */
  getOrg: OrgTransferOwnershipGetData_getOrg;
}

export interface OrgTransferOwnershipGetDataVariables {
  id: string;
}
