/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { VarType } from "./globalTypes";

// ====================================================
// GraphQL fragment: datamapsFields
// ====================================================

export interface datamapsFields_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface datamapsFields_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export interface datamapsFields_value_DataMapObject_object_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface datamapsFields_value_DataMapObject_object_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export interface datamapsFields_value_DataMapObject_object_value_DataMapObject_object_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface datamapsFields_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface datamapsFields_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type datamapsFields_value_DataMapObject_object_value_DataMapObject_object_value = datamapsFields_value_DataMapObject_object_value_DataMapObject_object_value_DataMapObject | datamapsFields_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainer | datamapsFields_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainerArray;

export interface datamapsFields_value_DataMapObject_object_value_DataMapObject_object {
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
  value: datamapsFields_value_DataMapObject_object_value_DataMapObject_object_value | null;
}

export interface datamapsFields_value_DataMapObject_object_value_DataMapObject {
  __typename: "DataMapObject";
  /**
   * Contains a list of `DataMap`
   */
  object: datamapsFields_value_DataMapObject_object_value_DataMapObject_object[];
}

export interface datamapsFields_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface datamapsFields_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface datamapsFields_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type datamapsFields_value_DataMapObject_object_value_DataMapObjects_objects_value = datamapsFields_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapObject | datamapsFields_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainer | datamapsFields_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainerArray;

export interface datamapsFields_value_DataMapObject_object_value_DataMapObjects_objects {
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
  value: datamapsFields_value_DataMapObject_object_value_DataMapObjects_objects_value | null;
}

export interface datamapsFields_value_DataMapObject_object_value_DataMapObjects {
  __typename: "DataMapObjects";
  /**
   * Contains a list of lists of `DataMap`. This implements repeated object patterns.
   */
  objects: datamapsFields_value_DataMapObject_object_value_DataMapObjects_objects[][];
}

export type datamapsFields_value_DataMapObject_object_value = datamapsFields_value_DataMapObject_object_value_DataMapValueContainer | datamapsFields_value_DataMapObject_object_value_DataMapValueContainerArray | datamapsFields_value_DataMapObject_object_value_DataMapObject | datamapsFields_value_DataMapObject_object_value_DataMapObjects;

export interface datamapsFields_value_DataMapObject_object {
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
  value: datamapsFields_value_DataMapObject_object_value | null;
}

export interface datamapsFields_value_DataMapObject {
  __typename: "DataMapObject";
  /**
   * Contains a list of `DataMap`
   */
  object: datamapsFields_value_DataMapObject_object[];
}

export interface datamapsFields_value_DataMapObjects_objects_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface datamapsFields_value_DataMapObjects_objects_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export interface datamapsFields_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface datamapsFields_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface datamapsFields_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type datamapsFields_value_DataMapObjects_objects_value_DataMapObject_object_value = datamapsFields_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapObject | datamapsFields_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainer | datamapsFields_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainerArray;

export interface datamapsFields_value_DataMapObjects_objects_value_DataMapObject_object {
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
  value: datamapsFields_value_DataMapObjects_objects_value_DataMapObject_object_value | null;
}

export interface datamapsFields_value_DataMapObjects_objects_value_DataMapObject {
  __typename: "DataMapObject";
  /**
   * Contains a list of `DataMap`
   */
  object: datamapsFields_value_DataMapObjects_objects_value_DataMapObject_object[];
}

export interface datamapsFields_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface datamapsFields_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface datamapsFields_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type datamapsFields_value_DataMapObjects_objects_value_DataMapObjects_objects_value = datamapsFields_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapObject | datamapsFields_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainer | datamapsFields_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainerArray;

export interface datamapsFields_value_DataMapObjects_objects_value_DataMapObjects_objects {
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
  value: datamapsFields_value_DataMapObjects_objects_value_DataMapObjects_objects_value | null;
}

export interface datamapsFields_value_DataMapObjects_objects_value_DataMapObjects {
  __typename: "DataMapObjects";
  /**
   * Contains a list of lists of `DataMap`. This implements repeated object patterns.
   */
  objects: datamapsFields_value_DataMapObjects_objects_value_DataMapObjects_objects[][];
}

export type datamapsFields_value_DataMapObjects_objects_value = datamapsFields_value_DataMapObjects_objects_value_DataMapValueContainer | datamapsFields_value_DataMapObjects_objects_value_DataMapValueContainerArray | datamapsFields_value_DataMapObjects_objects_value_DataMapObject | datamapsFields_value_DataMapObjects_objects_value_DataMapObjects;

export interface datamapsFields_value_DataMapObjects_objects {
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
  value: datamapsFields_value_DataMapObjects_objects_value | null;
}

export interface datamapsFields_value_DataMapObjects {
  __typename: "DataMapObjects";
  /**
   * Contains a list of lists of `DataMap`. This implements repeated object patterns.
   */
  objects: datamapsFields_value_DataMapObjects_objects[][];
}

export type datamapsFields_value = datamapsFields_value_DataMapValueContainer | datamapsFields_value_DataMapValueContainerArray | datamapsFields_value_DataMapObject | datamapsFields_value_DataMapObjects;

export interface datamapsFields {
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
  value: datamapsFields_value | null;
}
