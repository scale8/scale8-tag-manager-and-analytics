/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserInvitePageData
// ====================================================

export interface UserInvitePageData_getOrg_invites_org_permissions {
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

export interface UserInvitePageData_getOrg_invites {
  __typename: "Invite";
  /**
   * Unique `Invite` id for this operation
   */
  id: string;
  /**
   * The email of the user invited
   */
  email: string;
  /**
   * The permissions the user wil have on the org once joined
   */
  org_permissions: UserInvitePageData_getOrg_invites_org_permissions;
  /**
   * The date the `Invite` was created
   */
  created_at: S8DateTime;
  /**
   * DateTime the `Invite` was last updated
   */
  updated_at: S8DateTime;
}

export interface UserInvitePageData_getOrg {
  __typename: "Org";
  /**
   * A unique `Org` ID
   */
  id: string;
  /**
   * List of `Invite`'s associated with this `Org`
   */
  invites: UserInvitePageData_getOrg_invites[];
}

export interface UserInvitePageData {
  /**
   * @bound=Org
   * Given a valid `Org` ID, this function will return an `Org` provided the API `User` has been granted at least **view** access.
   */
  getOrg: UserInvitePageData_getOrg;
}

export interface UserInvitePageDataVariables {
  id: string;
}
