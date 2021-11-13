/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Mode } from "./globalTypes";

// ====================================================
// GraphQL query operation: ConfigQueryData
// ====================================================

export interface ConfigQueryData_config_consent_purposes {
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

export interface ConfigQueryData_config_consent_vendors {
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

export interface ConfigQueryData_config_tag_manager_products {
  __typename: "TagManagerProduct";
  id: string;
  name: string;
  amount: number;
  page_views: number;
}

export interface ConfigQueryData_config_data_manager_products {
  __typename: "DataManagerProduct";
  id: string;
  name: string;
  amount: number;
  requests: number;
  gbs: number;
}

export interface ConfigQueryData_config {
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
  consent_purposes: ConfigQueryData_config_consent_purposes[];
  /**
   * A list of consent vendors
   */
  consent_vendors: ConfigQueryData_config_consent_vendors[];
  /**
   * A list of Tag Manager Products
   */
  tag_manager_products: ConfigQueryData_config_tag_manager_products[];
  /**
   * A list of Data Manager Products
   */
  data_manager_products: ConfigQueryData_config_data_manager_products[];
}

export interface ConfigQueryData {
  /**
   * The S8 `Config`. Contains all the common mappings for countries, time zones, condition types etc.
   */
  config: ConfigQueryData_config;
}
