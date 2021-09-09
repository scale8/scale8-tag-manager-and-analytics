/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActionGroupDuplicateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DuplicateActionGroup
// ====================================================

export interface DuplicateActionGroup_duplicateActionGroup {
  __typename: "ActionGroup";
  /**
   * `ActionGroup` ID
   */
  id: string;
}

export interface DuplicateActionGroup {
  /**
   * @bound=ActionGroup
   * Duplicate an existing `ActionGroup`. The duplicated will copy everything beneath `ActionGroup`, creating a new `ActionGroup` entity and linking it to the same `ActionGroupDistribution`
   */
  duplicateActionGroup: DuplicateActionGroup_duplicateActionGroup;
}

export interface DuplicateActionGroupVariables {
  actionGroupDuplicateInput: ActionGroupDuplicateInput;
}
