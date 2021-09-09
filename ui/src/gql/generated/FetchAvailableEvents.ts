/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TypeIcon, VarType, InputType, ValidationType } from "./globalTypes";

// ====================================================
// GraphQL query operation: FetchAvailableEvents
// ====================================================

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform {
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

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_validation_rules {
  __typename: "PlatformDataMapValidation";
  /**
   * Validation type
   */
  type: ValidationType;
  /**
   * Input value to check against
   */
  input_value: S8DataMapValue | null;
}

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_default_value = FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_default_value_DefaultValueContainer | FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_validation_rules {
  __typename: "PlatformDataMapValidation";
  /**
   * Validation type
   */
  type: ValidationType;
  /**
   * Input value to check against
   */
  input_value: S8DataMapValue | null;
}

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_default_value = FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules {
  __typename: "PlatformDataMapValidation";
  /**
   * Validation type
   */
  type: ValidationType;
  /**
   * Input value to check against
   */
  input_value: S8DataMapValue | null;
}

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value = FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps {
  __typename: "PlatformDataMap";
  /**
   * ID of the `PlatformDataMap`
   */
  id: string;
  /**
   * Key (Property Key) of the `PlatformDataMap`
   */
  key: string;
  /**
   * See `VarType`
   */
  var_type: VarType;
  /**
   * See `InputType`
   */
  input_type: InputType;
  /**
   * Description of the `PlatformDataMap`
   */
  description: string;
  /**
   * Icon
   */
  icon: TypeIcon | null;
  /**
   * Option value - used when `PlatformDataMap` is a SELECT or RADIO `InputType` to provide a complete list of values to choose from
   */
  option_values: S8DataMapValue[] | null;
  /**
   * A list of validation rules associated with this `PlatformDataMap`.
   */
  validation_rules: FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value | null;
}

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps {
  __typename: "PlatformDataMap";
  /**
   * ID of the `PlatformDataMap`
   */
  id: string;
  /**
   * Key (Property Key) of the `PlatformDataMap`
   */
  key: string;
  /**
   * See `VarType`
   */
  var_type: VarType;
  /**
   * See `InputType`
   */
  input_type: InputType;
  /**
   * Description of the `PlatformDataMap`
   */
  description: string;
  /**
   * Icon
   */
  icon: TypeIcon | null;
  /**
   * Option value - used when `PlatformDataMap` is a SELECT or RADIO `InputType` to provide a complete list of values to choose from
   */
  option_values: S8DataMapValue[] | null;
  /**
   * A list of validation rules associated with this `PlatformDataMap`.
   */
  validation_rules: FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps[];
}

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps {
  __typename: "PlatformDataMap";
  /**
   * ID of the `PlatformDataMap`
   */
  id: string;
  /**
   * Key (Property Key) of the `PlatformDataMap`
   */
  key: string;
  /**
   * See `VarType`
   */
  var_type: VarType;
  /**
   * See `InputType`
   */
  input_type: InputType;
  /**
   * Description of the `PlatformDataMap`
   */
  description: string;
  /**
   * Icon
   */
  icon: TypeIcon | null;
  /**
   * Option value - used when `PlatformDataMap` is a SELECT or RADIO `InputType` to provide a complete list of values to choose from
   */
  option_values: S8DataMapValue[] | null;
  /**
   * A list of validation rules associated with this `PlatformDataMap`.
   */
  validation_rules: FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps[];
}

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events {
  __typename: "PlatformEvent";
  /**
   * ID of the `PlatformEvent`
   */
  id: string;
  /**
   * Name of the `PlatformEvent`
   */
  name: string;
  /**
   * Icon
   */
  icon: TypeIcon | null;
  /**
   * Description of the `PlatformEvent`
   */
  description: string;
  /**
   * List of `PlatformDataMap`s that create a document style key => value map. This can be directly accessed by the event when called.
   */
  platform_data_maps: FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps[];
}

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * The `Platform` that owns this `PlatformRevision`
   */
  platform: FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform;
  /**
   * A list of events that are associated with this `PlatformRevision`
   */
  platform_events: FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision_platform_events[];
}

export interface FetchAvailableEvents_getTrigger_revision_app_platform_revisions {
  __typename: "AppPlatformRevision";
  /**
   * `AppPlatformRevision` ID
   */
  id: string;
  /**
   * `PlatformRevision` that is currently linked to this `AppPlatformRevision`
   */
  platform_revision: FetchAvailableEvents_getTrigger_revision_app_platform_revisions_platform_revision;
}

export interface FetchAvailableEvents_getTrigger_revision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Get all the `AppPlatformRevision`'s linked to this revision
   */
  app_platform_revisions: FetchAvailableEvents_getTrigger_revision_app_platform_revisions[];
}

export interface FetchAvailableEvents_getTrigger {
  __typename: "Trigger";
  /**
   * The ID of the `Trigger`
   */
  id: string;
  /**
   * Revision
   */
  revision: FetchAvailableEvents_getTrigger_revision;
}

export interface FetchAvailableEvents {
  /**
   * @bound=Trigger
   * Get a `Trigger` model from the `Trigger` ID
   */
  getTrigger: FetchAvailableEvents_getTrigger;
}

export interface FetchAvailableEventsVariables {
  triggerId: string;
}
