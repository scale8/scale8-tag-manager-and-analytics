/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EventDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteEvent
// ====================================================

export interface DeleteEvent_deleteEvent {
  __typename: "ModelDeleteAcknowledgement";
  /**
   * The ID of the model that has been deleted
   */
  id: string;
}

export interface DeleteEvent {
  /**
   * @bound=Event
   * Delete an `Event` and its children.
   */
  deleteEvent: DeleteEvent_deleteEvent[];
}

export interface DeleteEventVariables {
  eventDeleteInput: EventDeleteInput;
}
