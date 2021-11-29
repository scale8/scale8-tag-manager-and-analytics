/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TagType, RevisionEntityParentType, ActionGroupDistributionType } from "./globalTypes";

// ====================================================
// GraphQL query operation: PreviewFrameData
// ====================================================

export interface PreviewFrameData_getApp {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
  /**
   * Name of the Application
   */
  name: string;
}

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_events_event_CustomEvent {
  __typename: "CustomEvent";
  /**
   * The name of the event to listen for.
   */
  custom_name: string;
}

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_events_event_PlatformEvent_platform {
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

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_events_event_PlatformEvent {
  __typename: "PlatformEvent";
  /**
   * ID of the `PlatformEvent`
   */
  id: string;
  /**
   * `Platform` that contains this `PlatformEvent`
   */
  platform: PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_events_event_PlatformEvent_platform;
}

export type PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_events_event = PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_events_event_CustomEvent | PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_events_event_PlatformEvent;

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_events {
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
  event: PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_events_event;
}

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_condition_rules_platform_data_container_platform {
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

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_condition_rules_platform_data_container {
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
   * `Platform` that contains this `PlatformDataContainer`
   */
  platform: PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_condition_rules_platform_data_container_platform;
}

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_condition_rules {
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
  platform_data_container: PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_condition_rules_platform_data_container;
}

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_exception_rules_platform_data_container_platform {
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

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_exception_rules_platform_data_container {
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
   * `Platform` that contains this `PlatformDataContainer`
   */
  platform: PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_exception_rules_platform_data_container_platform;
}

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_exception_rules {
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
  platform_data_container: PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_exception_rules_platform_data_container;
}

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_trigger {
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
   * A list of events that must be satisfied in order for a `Trigger` to be triggered.
   */
  events: PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_events[];
  /**
   * A series of `ConditionRule`'s that must all happen before any actions can be performed from this `Trigger`
   */
  condition_rules: PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_condition_rules[];
  /**
   * Exceptions describe an optional set of `ConditionRule`'s that will preclude a `Trigger` from being triggered
   */
  exception_rules: PreviewFrameData_getRevision_tags_rule_groups_rules_trigger_exception_rules[];
}

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_action_groups_distributions_action_groups_actions_platform_action_platform {
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

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_action_groups_distributions_action_groups_actions_platform_action {
  __typename: "PlatformAction";
  /**
   * ID of the `PlatformAction`
   */
  id: string;
  /**
   * `Platform` that contains this `PlatformAction`
   */
  platform: PreviewFrameData_getRevision_tags_rule_groups_rules_action_groups_distributions_action_groups_actions_platform_action_platform;
}

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_action_groups_distributions_action_groups_actions {
  __typename: "Action";
  /**
   * `Action` ID
   */
  id: string;
  /**
   * `Action` name
   */
  name: string;
  /**
   * `PlatformAction` that this `Action` implements
   */
  platform_action: PreviewFrameData_getRevision_tags_rule_groups_rules_action_groups_distributions_action_groups_actions_platform_action;
}

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_action_groups_distributions_action_groups {
  __typename: "ActionGroup";
  /**
   * `ActionGroup` ID
   */
  id: string;
  /**
   * `ActionGroup` name
   */
  name: string;
  /**
   * `Action`'s linked to this `ActionGroup`
   */
  actions: PreviewFrameData_getRevision_tags_rule_groups_rules_action_groups_distributions_action_groups_actions[];
  /**
   * Distribution value. -1 = Not distributed. Value is between -1 and 1000 inclusive.
   */
  distribution: number;
  /**
   * If the distribution of this `ActionGroup` is locked
   */
  is_locked: boolean;
}

export interface PreviewFrameData_getRevision_tags_rule_groups_rules_action_groups_distributions {
  __typename: "ActionGroupDistribution";
  /**
   * `ActionGroupDistribution` ID
   */
  id: string;
  /**
   * `ActionGroupDistribution` name
   */
  name: string;
  /**
   * Type of entity this model is bound to
   */
  parent_type: RevisionEntityParentType;
  /**
   * `ActionGroupDistribution` distribution type (see `ActionGroupDistributionType`)
   */
  action_group_distribution_type: ActionGroupDistributionType;
  /**
   * `ActionGroup`'s associated with this `ActionGroupDistribution`
   */
  action_groups: PreviewFrameData_getRevision_tags_rule_groups_rules_action_groups_distributions_action_groups[];
}

export interface PreviewFrameData_getRevision_tags_rule_groups_rules {
  __typename: "Rule";
  /**
   * The ID of the `Rule`
   */
  id: string;
  /**
   * The name of the `Rule`
   */
  name: string;
  /**
   * A `Trigger` attached to the `Rule`.
   */
  trigger: PreviewFrameData_getRevision_tags_rule_groups_rules_trigger;
  /**
   * All set of `ActionGroupDistribution`'s attached to this `Rule` and will be
   * triggered once `Event` and `ConditionRule`'s are considered
   */
  action_groups_distributions: PreviewFrameData_getRevision_tags_rule_groups_rules_action_groups_distributions[];
  /**
   * If the `Rule` is currently active or inactive
   */
  is_active: boolean;
}

export interface PreviewFrameData_getRevision_tags_rule_groups {
  __typename: "RuleGroup";
  /**
   * The `RuleGroup` ID
   */
  id: string;
  /**
   * Name associated with the `RuleGroup`
   */
  name: string;
  /**
   * If the `RuleGroup` is active or inactive
   */
  is_active: boolean;
  /**
   * A set of rules attached to the `RuleGroup`.
   */
  rules: PreviewFrameData_getRevision_tags_rule_groups_rules[];
}

export interface PreviewFrameData_getRevision_tags {
  __typename: "Tag";
  /**
   * Tag ID
   */
  id: string;
  /**
   * Tag name
   */
  name: string;
  /**
   * Tag code, this persists when cloned. It is generated by the parent tag and
   * inherited by all other tags cloned from this point. It is immutable by design.
   */
  tag_code: string;
  /**
   * Tag type, see `TagType`
   */
  type: TagType;
  /**
   * A set of `RuleGroup`s attached to this tag.
   */
  rule_groups: PreviewFrameData_getRevision_tags_rule_groups[];
  /**
   * An optional height parameter, used for placements.
   */
  height: number;
  /**
   * An optional width parameter, used for placements.
   */
  width: number;
}

export interface PreviewFrameData_getRevision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Revision Name
   */
  name: string;
  /**
   * Revision has been finalised and locked to prevent further changes
   */
  locked: boolean;
  /**
   * Get all the tags linked to this revision
   */
  tags: PreviewFrameData_getRevision_tags[];
}

export interface PreviewFrameData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: PreviewFrameData_getApp;
  /**
   * @bound=Revision
   * Finds a Revision By Id
   */
  getRevision: PreviewFrameData_getRevision;
}

export interface PreviewFrameDataVariables {
  revisionId: string;
  appId: string;
}
