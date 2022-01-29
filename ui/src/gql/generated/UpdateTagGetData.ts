/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TagType } from "./globalTypes";

// ====================================================
// GraphQL query operation: UpdateTagGetData
// ====================================================

export interface UpdateTagGetData_getTag {
  __typename: "Tag";
  /**
   * Tag ID
   */
  id: string;
  /**
   * Tag name
   */
  name: string;
  /**
   * Tag type, see `TagType`
   */
  type: TagType;
  /**
   * An optional width parameter, used for placements.
   */
  width: number;
  /**
   * An optional height parameter, used for placements.
   */
  height: number;
  /**
   * If the tag should be automatically loaded on all pages.
   */
  auto_load: boolean;
}

export interface UpdateTagGetData {
  /**
   * @bound=Tag
   * Get an Tag model from the Tag ID
   */
  getTag: UpdateTagGetData_getTag;
}

export interface UpdateTagGetDataVariables {
  id: string;
}
