/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { VarType } from "./globalTypes";

// ====================================================
// GraphQL fragment: datamapsFieldsLvl1
// ====================================================

export interface datamapsFieldsLvl1_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface datamapsFieldsLvl1_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export interface datamapsFieldsLvl1_value_DataMapObject_object_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface datamapsFieldsLvl1_value_DataMapObject_object_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface datamapsFieldsLvl1_value_DataMapObject_object_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type datamapsFieldsLvl1_value_DataMapObject_object_value = datamapsFieldsLvl1_value_DataMapObject_object_value_DataMapObject | datamapsFieldsLvl1_value_DataMapObject_object_value_DataMapValueContainer | datamapsFieldsLvl1_value_DataMapObject_object_value_DataMapValueContainerArray;

export interface datamapsFieldsLvl1_value_DataMapObject_object {
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
  value: datamapsFieldsLvl1_value_DataMapObject_object_value | null;
}

export interface datamapsFieldsLvl1_value_DataMapObject {
  __typename: "DataMapObject";
  /**
   * Contains a list of `DataMap`
   */
  object: datamapsFieldsLvl1_value_DataMapObject_object[];
}

export interface datamapsFieldsLvl1_value_DataMapObjects_objects_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface datamapsFieldsLvl1_value_DataMapObjects_objects_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface datamapsFieldsLvl1_value_DataMapObjects_objects_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type datamapsFieldsLvl1_value_DataMapObjects_objects_value = datamapsFieldsLvl1_value_DataMapObjects_objects_value_DataMapObject | datamapsFieldsLvl1_value_DataMapObjects_objects_value_DataMapValueContainer | datamapsFieldsLvl1_value_DataMapObjects_objects_value_DataMapValueContainerArray;

export interface datamapsFieldsLvl1_value_DataMapObjects_objects {
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
  value: datamapsFieldsLvl1_value_DataMapObjects_objects_value | null;
}

export interface datamapsFieldsLvl1_value_DataMapObjects {
  __typename: "DataMapObjects";
  /**
   * Contains a list of lists of `DataMap`. This implements repeated object patterns.
   */
  objects: datamapsFieldsLvl1_value_DataMapObjects_objects[][];
}

export type datamapsFieldsLvl1_value = datamapsFieldsLvl1_value_DataMapValueContainer | datamapsFieldsLvl1_value_DataMapValueContainerArray | datamapsFieldsLvl1_value_DataMapObject | datamapsFieldsLvl1_value_DataMapObjects;

export interface datamapsFieldsLvl1 {
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
  value: datamapsFieldsLvl1_value | null;
}
