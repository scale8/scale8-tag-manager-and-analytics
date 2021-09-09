/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateOrgUserGetData
// ====================================================

export interface UpdateOrgUserGetData_getOrgUserPermissions {
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

export interface UpdateOrgUserGetData {
  /**
   * @bound=Org
   * Given a valid `Org` ID and the ID of an `User` connected to the org it will return the permissions for that `User`
   */
  getOrgUserPermissions: UpdateOrgUserGetData_getOrgUserPermissions;
}

export interface UpdateOrgUserGetDataVariables {
  orgId: string;
  userId: string;
}
