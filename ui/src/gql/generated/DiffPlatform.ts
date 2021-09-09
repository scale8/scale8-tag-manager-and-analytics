/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DiffPlatform
// ====================================================

export interface DiffPlatform_platformRevisionDifference_props_left_StringBox {
  __typename: "StringBox";
  /**
   * Represents a single string value
   */
  s: string;
}

export interface DiffPlatform_platformRevisionDifference_props_left_IntBox {
  __typename: "IntBox";
  /**
   * Represents a single integer value
   */
  i: number;
}

export interface DiffPlatform_platformRevisionDifference_props_left_FloatBox {
  __typename: "FloatBox";
  /**
   * Represents a single float value
   */
  f: number;
}

export interface DiffPlatform_platformRevisionDifference_props_left_BooleanBox {
  __typename: "BooleanBox";
  /**
   * Represents a single boolean value
   */
  b: boolean;
}

export interface DiffPlatform_platformRevisionDifference_props_left_DateBox {
  __typename: "DateBox";
  /**
   * Represents a single date value
   */
  d: S8DateTime;
}

export interface DiffPlatform_platformRevisionDifference_props_left_StringArrayBox {
  __typename: "StringArrayBox";
  /**
   * Represents a list of strings
   */
  sa: string[];
}

export interface DiffPlatform_platformRevisionDifference_props_left_IntArrayBox {
  __typename: "IntArrayBox";
  /**
   * Represents a list of integers
   */
  ia: number[];
}

export interface DiffPlatform_platformRevisionDifference_props_left_FloatArrayBox {
  __typename: "FloatArrayBox";
  /**
   * Represents a list of floats
   */
  fa: number[];
}

export interface DiffPlatform_platformRevisionDifference_props_left_BooleanArrayBox {
  __typename: "BooleanArrayBox";
  /**
   * Represents a list of booleans
   */
  ba: boolean[];
}

export interface DiffPlatform_platformRevisionDifference_props_left_DateArrayBox {
  __typename: "DateArrayBox";
  /**
   * Represents a list of dates
   */
  da: S8DateTime[];
}

export interface DiffPlatform_platformRevisionDifference_props_left_EmptyArrayBox {
  __typename: "EmptyArrayBox";
  /**
   * Represents an empty array
   */
  ea: boolean | null;
}

export type DiffPlatform_platformRevisionDifference_props_left = DiffPlatform_platformRevisionDifference_props_left_StringBox | DiffPlatform_platformRevisionDifference_props_left_IntBox | DiffPlatform_platformRevisionDifference_props_left_FloatBox | DiffPlatform_platformRevisionDifference_props_left_BooleanBox | DiffPlatform_platformRevisionDifference_props_left_DateBox | DiffPlatform_platformRevisionDifference_props_left_StringArrayBox | DiffPlatform_platformRevisionDifference_props_left_IntArrayBox | DiffPlatform_platformRevisionDifference_props_left_FloatArrayBox | DiffPlatform_platformRevisionDifference_props_left_BooleanArrayBox | DiffPlatform_platformRevisionDifference_props_left_DateArrayBox | DiffPlatform_platformRevisionDifference_props_left_EmptyArrayBox;

export interface DiffPlatform_platformRevisionDifference_props_right_StringBox {
  __typename: "StringBox";
  /**
   * Represents a single string value
   */
  s: string;
}

export interface DiffPlatform_platformRevisionDifference_props_right_IntBox {
  __typename: "IntBox";
  /**
   * Represents a single integer value
   */
  i: number;
}

export interface DiffPlatform_platformRevisionDifference_props_right_FloatBox {
  __typename: "FloatBox";
  /**
   * Represents a single float value
   */
  f: number;
}

export interface DiffPlatform_platformRevisionDifference_props_right_BooleanBox {
  __typename: "BooleanBox";
  /**
   * Represents a single boolean value
   */
  b: boolean;
}

export interface DiffPlatform_platformRevisionDifference_props_right_DateBox {
  __typename: "DateBox";
  /**
   * Represents a single date value
   */
  d: S8DateTime;
}

export interface DiffPlatform_platformRevisionDifference_props_right_StringArrayBox {
  __typename: "StringArrayBox";
  /**
   * Represents a list of strings
   */
  sa: string[];
}

export interface DiffPlatform_platformRevisionDifference_props_right_IntArrayBox {
  __typename: "IntArrayBox";
  /**
   * Represents a list of integers
   */
  ia: number[];
}

export interface DiffPlatform_platformRevisionDifference_props_right_FloatArrayBox {
  __typename: "FloatArrayBox";
  /**
   * Represents a list of floats
   */
  fa: number[];
}

export interface DiffPlatform_platformRevisionDifference_props_right_BooleanArrayBox {
  __typename: "BooleanArrayBox";
  /**
   * Represents a list of booleans
   */
  ba: boolean[];
}

export interface DiffPlatform_platformRevisionDifference_props_right_DateArrayBox {
  __typename: "DateArrayBox";
  /**
   * Represents a list of dates
   */
  da: S8DateTime[];
}

export interface DiffPlatform_platformRevisionDifference_props_right_EmptyArrayBox {
  __typename: "EmptyArrayBox";
  /**
   * Represents an empty array
   */
  ea: boolean | null;
}

export type DiffPlatform_platformRevisionDifference_props_right = DiffPlatform_platformRevisionDifference_props_right_StringBox | DiffPlatform_platformRevisionDifference_props_right_IntBox | DiffPlatform_platformRevisionDifference_props_right_FloatBox | DiffPlatform_platformRevisionDifference_props_right_BooleanBox | DiffPlatform_platformRevisionDifference_props_right_DateBox | DiffPlatform_platformRevisionDifference_props_right_StringArrayBox | DiffPlatform_platformRevisionDifference_props_right_IntArrayBox | DiffPlatform_platformRevisionDifference_props_right_FloatArrayBox | DiffPlatform_platformRevisionDifference_props_right_BooleanArrayBox | DiffPlatform_platformRevisionDifference_props_right_DateArrayBox | DiffPlatform_platformRevisionDifference_props_right_EmptyArrayBox;

export interface DiffPlatform_platformRevisionDifference_props {
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
  left: DiffPlatform_platformRevisionDifference_props_left | null;
  /**
   * The value associated with the right model's field
   */
  right: DiffPlatform_platformRevisionDifference_props_right | null;
}

export interface DiffPlatform_platformRevisionDifference {
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
  props: DiffPlatform_platformRevisionDifference_props[];
}

export interface DiffPlatform {
  /**
   * @bound=PlatformRevision
   * Provides the left and right comparison of two revisions
   */
  platformRevisionDifference: DiffPlatform_platformRevisionDifference[];
}

export interface DiffPlatformVariables {
  leftId: string;
  rightId: string;
}
