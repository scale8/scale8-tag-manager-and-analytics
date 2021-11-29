/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DiffApp
// ====================================================

export interface DiffApp_revisionDifference_props_left_StringBox {
  __typename: "StringBox";
  /**
   * Represents a single string value
   */
  s: string;
}

export interface DiffApp_revisionDifference_props_left_IntBox {
  __typename: "IntBox";
  /**
   * Represents a single integer value
   */
  i: number;
}

export interface DiffApp_revisionDifference_props_left_FloatBox {
  __typename: "FloatBox";
  /**
   * Represents a single float value
   */
  f: number;
}

export interface DiffApp_revisionDifference_props_left_BooleanBox {
  __typename: "BooleanBox";
  /**
   * Represents a single boolean value
   */
  b: boolean;
}

export interface DiffApp_revisionDifference_props_left_DateBox {
  __typename: "DateBox";
  /**
   * Represents a single date value
   */
  d: S8DateTime;
}

export interface DiffApp_revisionDifference_props_left_StringArrayBox {
  __typename: "StringArrayBox";
  /**
   * Represents a list of strings
   */
  sa: string[];
}

export interface DiffApp_revisionDifference_props_left_IntArrayBox {
  __typename: "IntArrayBox";
  /**
   * Represents a list of integers
   */
  ia: number[];
}

export interface DiffApp_revisionDifference_props_left_FloatArrayBox {
  __typename: "FloatArrayBox";
  /**
   * Represents a list of floats
   */
  fa: number[];
}

export interface DiffApp_revisionDifference_props_left_BooleanArrayBox {
  __typename: "BooleanArrayBox";
  /**
   * Represents a list of booleans
   */
  ba: boolean[];
}

export interface DiffApp_revisionDifference_props_left_DateArrayBox {
  __typename: "DateArrayBox";
  /**
   * Represents a list of dates
   */
  da: S8DateTime[];
}

export interface DiffApp_revisionDifference_props_left_EmptyArrayBox {
  __typename: "EmptyArrayBox";
  /**
   * Represents an empty array
   */
  ea: boolean | null;
}

export type DiffApp_revisionDifference_props_left = DiffApp_revisionDifference_props_left_StringBox | DiffApp_revisionDifference_props_left_IntBox | DiffApp_revisionDifference_props_left_FloatBox | DiffApp_revisionDifference_props_left_BooleanBox | DiffApp_revisionDifference_props_left_DateBox | DiffApp_revisionDifference_props_left_StringArrayBox | DiffApp_revisionDifference_props_left_IntArrayBox | DiffApp_revisionDifference_props_left_FloatArrayBox | DiffApp_revisionDifference_props_left_BooleanArrayBox | DiffApp_revisionDifference_props_left_DateArrayBox | DiffApp_revisionDifference_props_left_EmptyArrayBox;

export interface DiffApp_revisionDifference_props_right_StringBox {
  __typename: "StringBox";
  /**
   * Represents a single string value
   */
  s: string;
}

export interface DiffApp_revisionDifference_props_right_IntBox {
  __typename: "IntBox";
  /**
   * Represents a single integer value
   */
  i: number;
}

export interface DiffApp_revisionDifference_props_right_FloatBox {
  __typename: "FloatBox";
  /**
   * Represents a single float value
   */
  f: number;
}

export interface DiffApp_revisionDifference_props_right_BooleanBox {
  __typename: "BooleanBox";
  /**
   * Represents a single boolean value
   */
  b: boolean;
}

export interface DiffApp_revisionDifference_props_right_DateBox {
  __typename: "DateBox";
  /**
   * Represents a single date value
   */
  d: S8DateTime;
}

export interface DiffApp_revisionDifference_props_right_StringArrayBox {
  __typename: "StringArrayBox";
  /**
   * Represents a list of strings
   */
  sa: string[];
}

export interface DiffApp_revisionDifference_props_right_IntArrayBox {
  __typename: "IntArrayBox";
  /**
   * Represents a list of integers
   */
  ia: number[];
}

export interface DiffApp_revisionDifference_props_right_FloatArrayBox {
  __typename: "FloatArrayBox";
  /**
   * Represents a list of floats
   */
  fa: number[];
}

export interface DiffApp_revisionDifference_props_right_BooleanArrayBox {
  __typename: "BooleanArrayBox";
  /**
   * Represents a list of booleans
   */
  ba: boolean[];
}

export interface DiffApp_revisionDifference_props_right_DateArrayBox {
  __typename: "DateArrayBox";
  /**
   * Represents a list of dates
   */
  da: S8DateTime[];
}

export interface DiffApp_revisionDifference_props_right_EmptyArrayBox {
  __typename: "EmptyArrayBox";
  /**
   * Represents an empty array
   */
  ea: boolean | null;
}

export type DiffApp_revisionDifference_props_right = DiffApp_revisionDifference_props_right_StringBox | DiffApp_revisionDifference_props_right_IntBox | DiffApp_revisionDifference_props_right_FloatBox | DiffApp_revisionDifference_props_right_BooleanBox | DiffApp_revisionDifference_props_right_DateBox | DiffApp_revisionDifference_props_right_StringArrayBox | DiffApp_revisionDifference_props_right_IntArrayBox | DiffApp_revisionDifference_props_right_FloatArrayBox | DiffApp_revisionDifference_props_right_BooleanArrayBox | DiffApp_revisionDifference_props_right_DateArrayBox | DiffApp_revisionDifference_props_right_EmptyArrayBox;

export interface DiffApp_revisionDifference_props {
  __typename: "RevisionDiffProp";
  /**
   * The name of the field belonging to the model
   */
  field: string;
  /**
   * The name of the field belonging to the model as described in GraphQL
   */
  gqlField: string;
  /**
   * The state of the fields when compared with each other
   */
  state: string;
  /**
   * If the field is a reference to another model
   */
  ref: boolean;
  /**
   * The value associated with the left model's field
   */
  left: DiffApp_revisionDifference_props_left | null;
  /**
   * The value associated with the right model's field
   */
  right: DiffApp_revisionDifference_props_right | null;
}

export interface DiffApp_revisionDifference {
  __typename: "RevisionDiff";
  /**
   * The ID that symbolically links the two models. One will have been cloned from the other if both exist
   */
  id: string;
  /**
   * Name of the model
   */
  model: string;
  /**
   * The model held on the left
   */
  left: string | null;
  /**
   * The model held on the right
   */
  right: string | null;
  /**
   * The overall state of the model
   */
  state: string | null;
  /**
   * The properties of the model
   */
  props: DiffApp_revisionDifference_props[];
}

export interface DiffApp {
  /**
   * @bound=Revision
   * Provides the left and right comparison of two revisions
   */
  revisionDifference: DiffApp_revisionDifference[];
}

export interface DiffAppVariables {
  leftId: string;
  rightId: string;
}
