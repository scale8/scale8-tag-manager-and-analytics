/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateCustomDomainGetQueryData
// ====================================================

export interface UpdateCustomDomainGetQueryData_getEnvironment_revision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
}

export interface UpdateCustomDomainGetQueryData_getEnvironment {
  __typename: "Environment";
  /**
   * `Environment` ID
   */
  id: string;
  /**
   * `Environment` name
   */
  name: string;
  /**
   * `Environment` URL
   */
  url: string | null;
  /**
   * `Environment`'s custom domain name if configured
   */
  custom_domain: string | null;
  /**
   * `Environment`'s install domain used to embed in web page
   */
  install_domain: string;
  /**
   * `Revision` currently attached to the `Environment`
   */
  revision: UpdateCustomDomainGetQueryData_getEnvironment_revision;
}

export interface UpdateCustomDomainGetQueryData {
  /**
   * @bound=Environment
   * Get an `Environment` model from `Environment` ID
   */
  getEnvironment: UpdateCustomDomainGetQueryData_getEnvironment;
}

export interface UpdateCustomDomainGetQueryDataVariables {
  id: string;
}
