/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationOwner, AuditAction, GQLMethod } from "./globalTypes";

// ====================================================
// GraphQL query operation: EntitiesHistory
// ====================================================

export interface EntitiesHistory_getHistoryForEntities_user {
  __typename: "OrgUser";
  /**
   * `OrgUser` ID
   */
  id: string;
  /**
   * `OrgUser`'s first name
   */
  first_name: string;
  /**
   * `OrgUser`'s last name
   */
  last_name: string;
}

export interface EntitiesHistory_getHistoryForEntities_connected_models {
  __typename: "OperationConnectedModel";
  /**
   * Model ID
   */
  id: string;
  /**
   * Model Type
   */
  type: string;
}

export interface EntitiesHistory_getHistoryForEntities {
  __typename: "Audit";
  /**
   * Unique audit id for this operation
   */
  id: string;
  /**
   * Person performing the operation, can be undefined if the system has performed the operation instead
   */
  user: EntitiesHistory_getHistoryForEntities_user | null;
  /**
   * Operation owner
   */
  owner: OperationOwner;
  /**
   * Entity on which the operation was performed
   */
  model_id: string;
  /**
   * Name of the model
   */
  model: string;
  /**
   * Model's persisting id
   */
  model_persisting_id: string;
  /**
   * Models directly connected to (or influenced by) this operation
   */
  connected_models: EntitiesHistory_getHistoryForEntities_connected_models[];
  /**
   * Action Preformed
   */
  action: AuditAction;
  /**
   * Method in which the action was performed
   */
  method: GQLMethod;
  /**
   * Optional user comments linked to this operation
   */
  comments: string | null;
  /**
   * The date the `Audit` was created
   */
  created_at: S8DateTime;
}

export interface EntitiesHistory {
  /**
   * @bound=Audit
   * Get the history for all entities
   */
  getHistoryForEntities: EntitiesHistory_getHistoryForEntities[];
}

export interface EntitiesHistoryVariables {
  entities: string[];
}
