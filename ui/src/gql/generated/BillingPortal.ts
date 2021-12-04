/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { BillingPortalInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: BillingPortal
// ====================================================

export interface BillingPortal {
  /**
   * @bound=Org
   * Billing portal
   */
  getBillingPortalUrl: string;
}

export interface BillingPortalVariables {
  billingPortalInput?: BillingPortalInput | null;
}
