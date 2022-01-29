/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { NotificationType, DataManagerStringMacros, DataManagerIntegerMacros, DataManagerDateTimeMacros, DataManagerTimestampMacros } from "./globalTypes";

// ====================================================
// GraphQL query operation: getImportedTypes
// ====================================================

export interface getImportedTypes_extra_types {
  __typename: "ExtraTypes";
  notification_type: NotificationType | null;
  dm_macros_string: DataManagerStringMacros | null;
  dm_macros_integer: DataManagerIntegerMacros | null;
  dm_macros_date: DataManagerDateTimeMacros | null;
  dm_macros_ts: DataManagerTimestampMacros | null;
}

export interface getImportedTypes {
  /**
   * Type exposure to share enumeration types with frontends
   */
  extra_types: getImportedTypes_extra_types | null;
}
