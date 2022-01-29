/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GlobalTriggerData
// ====================================================

export interface GlobalTriggerData_getRevision_global_triggers_events {
  __typename: "Event";
  /**
   * The `Event` ID
   */
  id: string;
}

export interface GlobalTriggerData_getRevision_global_triggers_condition_rules {
  __typename: "ConditionRule";
  /**
   * `ConditionRule` ID
   */
  id: string;
}

export interface GlobalTriggerData_getRevision_global_triggers_exception_rules {
  __typename: "ConditionRule";
  /**
   * `ConditionRule` ID
   */
  id: string;
}

export interface GlobalTriggerData_getRevision_global_triggers {
  __typename: "Trigger";
  /**
   * The ID of the `Trigger`
   */
  id: string;
  /**
   * The name of the `Trigger`
   */
  name: string;
  /**
   * A list of events that must be satisfied in order for a `Trigger` to be triggered.
   */
  events: GlobalTriggerData_getRevision_global_triggers_events[];
  /**
   * A series of `ConditionRule`'s that must all happen before any actions can be performed from this `Trigger`
   */
  condition_rules: GlobalTriggerData_getRevision_global_triggers_condition_rules[];
  /**
   * Exceptions describe an optional set of `ConditionRule`'s that will preclude a `Trigger` from being triggered
   */
  exception_rules: GlobalTriggerData_getRevision_global_triggers_exception_rules[];
  /**
   * Date the trigger was created
   */
  created_at: S8DateTime;
  /**
   * Date the trigger was last updated
   */
  updated_at: S8DateTime;
}

export interface GlobalTriggerData_getRevision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Revision has been finalised and locked to prevent further changes
   */
  locked: boolean;
  /**
   * Get all the global triggers linked to this revision
   */
  global_triggers: GlobalTriggerData_getRevision_global_triggers[];
}

export interface GlobalTriggerData {
  /**
   * @bound=Revision
   * Finds a Revision By Id
   */
  getRevision: GlobalTriggerData_getRevision;
}

export interface GlobalTriggerDataVariables {
  id: string;
}
