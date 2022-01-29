/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateCustomDomainGetQueryData
// ====================================================

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
   * `Environment`'s CNAME
   */
  cname: string;
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
