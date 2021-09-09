/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DismissNotificationInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DismissUserNotification
// ====================================================

export interface DismissUserNotification {
  /**
   * @bound=UserNotification
   * Mark the current notification as viewed
   */
  dismissNotification: boolean;
}

export interface DismissUserNotificationVariables {
  dismissNotificationInput: DismissNotificationInput;
}
