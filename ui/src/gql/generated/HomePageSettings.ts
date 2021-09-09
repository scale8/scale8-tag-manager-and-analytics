/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: HomePageSettings
// ====================================================

export interface HomePageSettings_config_tag_manager_products {
  __typename: "TagManagerProduct";
  id: string;
  name: string;
  amount: number;
  page_views: number;
}

export interface HomePageSettings_config_data_manager_products {
  __typename: "DataManagerProduct";
  id: string;
  name: string;
  amount: number;
  requests: number;
  gbs: number;
}

export interface HomePageSettings_config {
  __typename: "Config";
  /**
   * A list of Tag Manager Products
   */
  tag_manager_products: HomePageSettings_config_tag_manager_products[];
  /**
   * A list of Data Manager Products
   */
  data_manager_products: HomePageSettings_config_data_manager_products[];
}

export interface HomePageSettings {
  /**
   * The S8 `Config`. Contains all the common mappings for countries, time zones, condition types etc.
   */
  config: HomePageSettings_config;
}
