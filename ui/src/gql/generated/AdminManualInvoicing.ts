/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SwitchToManualInvoicingInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AdminManualInvoicing
// ====================================================

export interface AdminManualInvoicing {
  /**
   * @bound=Org
   * Switch to manual invoicing (admin only)
   */
  switchToManualInvoicing: boolean;
}

export interface AdminManualInvoicingVariables {
  switchToManualInvoicingInput: SwitchToManualInvoicingInput;
}
