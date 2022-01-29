/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchAvailableGlobalTriggers
// ====================================================

export interface FetchAvailableGlobalTriggers_getTag_revision_global_triggers {
  __typename: "Trigger";
  /**
   * The ID of the `Trigger`
   */
  id: string;
  /**
   * The name of the `Trigger`
   */
  name: string;
}

export interface FetchAvailableGlobalTriggers_getTag_revision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Get all the global triggers linked to this revision
   */
  global_triggers: FetchAvailableGlobalTriggers_getTag_revision_global_triggers[];
}

export interface FetchAvailableGlobalTriggers_getTag {
  __typename: "Tag";
  /**
   * Tag ID
   */
  id: string;
  /**
   * Revision
   */
  revision: FetchAvailableGlobalTriggers_getTag_revision;
}

export interface FetchAvailableGlobalTriggers {
  /**
   * @bound=Tag
   * Get an Tag model from the Tag ID
   */
  getTag: FetchAvailableGlobalTriggers_getTag;
}

export interface FetchAvailableGlobalTriggersVariables {
  tagId: string;
}
