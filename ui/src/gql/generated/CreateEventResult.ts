/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EventCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateEventResult
// ====================================================

export interface CreateEventResult_createEvent {
  __typename: "Event";
  /**
   * The `Event` ID
   */
  id: string;
}

export interface CreateEventResult {
  /**
   * @bound=Event
   * Create a new `Event`.
   */
  createEvent: CreateEventResult_createEvent;
}

export interface CreateEventResultVariables {
  eventCreateInput: EventCreateInput;
}
