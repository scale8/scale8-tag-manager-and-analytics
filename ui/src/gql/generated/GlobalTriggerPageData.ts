/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RevisionEntityParentType, TypeIcon } from "./globalTypes";

// ====================================================
// GraphQL query operation: GlobalTriggerPageData
// ====================================================

export interface GlobalTriggerPageData_getTrigger_revision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Revision has been finalised and locked to prevent further changes
   */
  locked: boolean;
}

export interface GlobalTriggerPageData_getTrigger_events_event_CustomEvent {
  __typename: "CustomEvent";
  /**
   * The name of the event to listen for.
   */
  custom_name: string;
}

export interface GlobalTriggerPageData_getTrigger_events_event_PlatformEvent_platform {
  __typename: "Platform";
  /**
   * `Platform` ID
   */
  id: string;
  /**
   * `Platform` name
   */
  name: string;
}

export interface GlobalTriggerPageData_getTrigger_events_event_PlatformEvent {
  __typename: "PlatformEvent";
  /**
   * ID of the `PlatformEvent`
   */
  id: string;
  /**
   * `Platform` that contains this `PlatformEvent`
   */
  platform: GlobalTriggerPageData_getTrigger_events_event_PlatformEvent_platform;
}

export type GlobalTriggerPageData_getTrigger_events_event = GlobalTriggerPageData_getTrigger_events_event_CustomEvent | GlobalTriggerPageData_getTrigger_events_event_PlatformEvent;

export interface GlobalTriggerPageData_getTrigger_events {
  __typename: "Event";
  /**
   * The `Event` ID
   */
  id: string;
  /**
   * The `Event` name
   */
  name: string;
  /**
   * Either a `CustomEvent` or `PlatformEvent`
   */
  event: GlobalTriggerPageData_getTrigger_events_event;
}

export interface GlobalTriggerPageData_getTrigger_condition_rules_platform_data_container_platform {
  __typename: "Platform";
  /**
   * `Platform` ID
   */
  id: string;
  /**
   * `Platform` name
   */
  name: string;
}

export interface GlobalTriggerPageData_getTrigger_condition_rules_platform_data_container {
  __typename: "PlatformDataContainer";
  /**
   * ID of the `PlatformDataContainer`
   */
  id: string;
  /**
   * Name of the `PlatformDataContainer`
   */
  name: string;
  /**
   * Icon
   */
  icon: TypeIcon | null;
  /**
   * `Platform` that contains this `PlatformDataContainer`
   */
  platform: GlobalTriggerPageData_getTrigger_condition_rules_platform_data_container_platform;
}

export interface GlobalTriggerPageData_getTrigger_condition_rules {
  __typename: "ConditionRule";
  /**
   * `ConditionRule` ID
   */
  id: string;
  /**
   * `ConditionRule` name
   */
  name: string;
  /**
   * The `PlatformDataContainer` to match against
   */
  platform_data_container: GlobalTriggerPageData_getTrigger_condition_rules_platform_data_container;
}

export interface GlobalTriggerPageData_getTrigger_exception_rules_platform_data_container_platform {
  __typename: "Platform";
  /**
   * `Platform` ID
   */
  id: string;
  /**
   * `Platform` name
   */
  name: string;
}

export interface GlobalTriggerPageData_getTrigger_exception_rules_platform_data_container {
  __typename: "PlatformDataContainer";
  /**
   * ID of the `PlatformDataContainer`
   */
  id: string;
  /**
   * Name of the `PlatformDataContainer`
   */
  name: string;
  /**
   * Icon
   */
  icon: TypeIcon | null;
  /**
   * `Platform` that contains this `PlatformDataContainer`
   */
  platform: GlobalTriggerPageData_getTrigger_exception_rules_platform_data_container_platform;
}

export interface GlobalTriggerPageData_getTrigger_exception_rules {
  __typename: "ConditionRule";
  /**
   * `ConditionRule` ID
   */
  id: string;
  /**
   * `ConditionRule` name
   */
  name: string;
  /**
   * The `PlatformDataContainer` to match against
   */
  platform_data_container: GlobalTriggerPageData_getTrigger_exception_rules_platform_data_container;
}

export interface GlobalTriggerPageData_getTrigger {
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
   * Type of entity this model is bound to
   */
  parent_type: RevisionEntityParentType;
  /**
   * Revision
   */
  revision: GlobalTriggerPageData_getTrigger_revision;
  /**
   * A list of events that must be satisfied in order for a `Trigger` to be triggered.
   */
  events: GlobalTriggerPageData_getTrigger_events[];
  /**
   * A series of `ConditionRule`'s that must all happen before any actions can be performed from this `Trigger`
   */
  condition_rules: GlobalTriggerPageData_getTrigger_condition_rules[];
  /**
   * Exceptions describe an optional set of `ConditionRule`'s that will preclude a `Trigger` from being triggered
   */
  exception_rules: GlobalTriggerPageData_getTrigger_exception_rules[];
}

export interface GlobalTriggerPageData {
  /**
   * @bound=Trigger
   * Get a `Trigger` model from the `Trigger` ID
   */
  getTrigger: GlobalTriggerPageData_getTrigger;
}

export interface GlobalTriggerPageDataVariables {
  id: string;
}
