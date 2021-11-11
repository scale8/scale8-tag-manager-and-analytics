/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Mode } from "./globalTypes";

// ====================================================
// GraphQL query operation: LoggedUser
// ====================================================

export interface LoggedUser_me_invites_org {
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

export interface LoggedUser_me_invites {
  __typename: "Invite";
  /**
   * Unique `Invite` id for this operation
   */
  id: string;
  /**
   * The `Org` the user is invited to join
   */
  org: LoggedUser_me_invites_org;
}

export interface LoggedUser_me_user_notifications {
  __typename: "UserNotification";
  /**
   * `User Notification` ID
   */
  id: string;
  /**
   * `User Notification` Type
   */
  type: string;
  /**
   * Whether the `User Notification` has been viewed
   */
  is_viewed: boolean;
}

export interface LoggedUser_me {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
  /**
   * `User`'s first name
   */
  first_name: string;
  /**
   * `User`'s last name
   */
  last_name: string;
  /**
   * `User`'s email address
   */
  email: string;
  /**
   * List of `Invite`s the `User` has sent
   */
  invites: LoggedUser_me_invites[];
  /**
   * List of `Notification`s for the `User`
   */
  user_notifications: LoggedUser_me_user_notifications[];
  /**
   * Whether the `User` is an admin
   */
  is_admin: boolean;
  /**
   * `User`'s API token
   */
  api_token: string;
  /**
   * `User`'s two-factor auth enabled
   */
  two_factor_auth: boolean;
  /**
   * `User`'s email notifications enabled
   */
  email_notifications: boolean;
  /**
   * `User`'s GitHub username
   */
  github_user: string | null;
  /**
   * Whether the `User` is connected with a GitHub account
   */
  github_connected: boolean;
}

export interface LoggedUser_config_consent_purposes {
  __typename: "ConsentPurpose";
  /**
   * Consent Purpose ID
   */
  id: number;
  /**
   * Consent Purpose Name
   */
  name: string;
}

export interface LoggedUser_config_consent_vendors {
  __typename: "ConsentVendor";
  /**
   * Consent Vendor ID
   */
  id: number;
  /**
   * Consent Vendor Name
   */
  name: string;
}

export interface LoggedUser_config_tag_manager_products {
  __typename: "TagManagerProduct";
  id: string;
  name: string;
  amount: number;
  page_views: number;
}

export interface LoggedUser_config_data_manager_products {
  __typename: "DataManagerProduct";
  id: string;
  name: string;
  amount: number;
  requests: number;
  gbs: number;
}

export interface LoggedUser_config {
  __typename: "Config";
  /**
   * If the platform has been setup and configured yet
   */
  is_configured: boolean | null;
  /**
   * The backend started in developer mode
   */
  is_dev: boolean | null;
  /**
   * The application mode currently in use
   */
  mode: Mode;
  /**
   * Whether the application will allow signup
   */
  use_signup: boolean | null;
  /**
   * Whether the application will allow sending emails
   */
  use_email: boolean | null;
  /**
   * Whether the application will allow github single sign on
   */
  use_github_sso: boolean | null;
  /**
   * Whether the application will allow two-factor authentication
   */
  use_two_factor_auth: boolean | null;
  /**
   * Whether the application will record an audit trail
   */
  is_audit_enabled: boolean | null;
  /**
   * A list of consent purposes
   */
  consent_purposes: LoggedUser_config_consent_purposes[];
  /**
   * A list of consent vendors
   */
  consent_vendors: LoggedUser_config_consent_vendors[];
  /**
   * A list of Tag Manager Products
   */
  tag_manager_products: LoggedUser_config_tag_manager_products[];
  /**
   * A list of Data Manager Products
   */
  data_manager_products: LoggedUser_config_data_manager_products[];
}

export interface LoggedUser {
  /**
   * @bound=User
   * Get a the session user
   */
  me: LoggedUser_me;
  /**
   * The S8 `Config`. Contains all the common mappings for countries, time zones, condition types etc.
   */
  config: LoggedUser_config;
}
