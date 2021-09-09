/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { VarType } from "./globalTypes";

// ====================================================
// GraphQL fragment: datamapsFieldsLvl2
// ====================================================

export interface datamapsFieldsLvl2_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface datamapsFieldsLvl2_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface datamapsFieldsLvl2_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type datamapsFieldsLvl2_value = datamapsFieldsLvl2_value_DataMapObject | datamapsFieldsLvl2_value_DataMapValueContainer | datamapsFieldsLvl2_value_DataMapValueContainerArray;

export interface datamapsFieldsLvl2 {
  __typename: "DataMap";
  /**
   * `DataMap` ID
   */
  id: string;
  /**
   * `DataMap` key
   */
  key: string;
  /**
   * `DataMap` variable type (string, int, boolean, array of strings, object etc.)
   */
  var_type: VarType;
  /**
   * `DataMap` value
   */
  value: datamapsFieldsLvl2_value | null;
}
