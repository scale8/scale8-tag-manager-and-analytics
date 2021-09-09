/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EventUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateEventResult
// ====================================================

export interface UpdateEventResult {
  /**
   * @bound=Event
   * Update an `Event`.
   */
  updateEvent: boolean;
}

export interface UpdateEventResultVariables {
  eventUpdateInput: EventUpdateInput;
}
