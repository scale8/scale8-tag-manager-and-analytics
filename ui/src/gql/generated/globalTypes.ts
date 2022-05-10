/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * A set of supported AWS regions for use with `TrackedEnvironment`s
 */
export enum AWSRegion {
  AF_SOUTH_1 = "AF_SOUTH_1",
  AP_EAST_1 = "AP_EAST_1",
  AP_NORTHEAST_1 = "AP_NORTHEAST_1",
  AP_NORTHEAST_2 = "AP_NORTHEAST_2",
  AP_NORTHEAST_3 = "AP_NORTHEAST_3",
  AP_SOUTHEAST_1 = "AP_SOUTHEAST_1",
  AP_SOUTHEAST_2 = "AP_SOUTHEAST_2",
  AP_SOUTH_1 = "AP_SOUTH_1",
  CA_CENTRAL_1 = "CA_CENTRAL_1",
  CN_NORTHWEST_1 = "CN_NORTHWEST_1",
  EU_CENTRAL_1 = "EU_CENTRAL_1",
  EU_WEST_1 = "EU_WEST_1",
  US_EAST_1 = "US_EAST_1",
  US_EAST_2 = "US_EAST_2",
  US_WEST_1 = "US_WEST_1",
  US_WEST_2 = "US_WEST_2",
}

/**
 * A set of supported `AccountProduct`s
 */
export enum AccountProduct {
  DATA_MANAGER = "DATA_MANAGER",
  TAG_MANAGER = "TAG_MANAGER",
}

/**
 * A set of supported `ActionGroupDistributionType`s for use with `ActionGroupDistribution`s
 */
export enum ActionGroupDistributionType {
  NONE = "NONE",
  PAGE_LOAD = "PAGE_LOAD",
  SESSION = "SESSION",
}

/**
 * The type of `App` being created. `MOBILE` support will be added soon!
 */
export enum AppType {
  WEB = "WEB",
}

/**
 * A set of supported `AuditAction`s used by `Audit`
 */
export enum AuditAction {
  Clone = "Clone",
  Create = "Create",
  Delete = "Delete",
  Update = "Update",
}

/**
 * To be used with `ConditionRuleCreateInput`
 */
export enum ConditionMode {
  CONDITION = "CONDITION",
  EXCEPTION = "EXCEPTION",
}

/**
 * To be used with `ConditionRule`, these are the valid condition types currently supported.
 */
export enum ConditionType {
  BEGINS_WITH = "BEGINS_WITH",
  CONTAINS = "CONTAINS",
  ENDS_WITH = "ENDS_WITH",
  EQUAL = "EQUAL",
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_EQUAL = "GREATER_THAN_EQUAL",
  IS_DEFINED = "IS_DEFINED",
  IS_NOT_DEFINED = "IS_NOT_DEFINED",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_EQUAL = "LESS_THAN_EQUAL",
  NOT_EQUAL = "NOT_EQUAL",
  REGULAR_EXPRESSION = "REGULAR_EXPRESSION",
}

/**
 * A set of supported `Data Manager Macros` for `DateTime` values.
 */
export enum DataManagerDateTimeMacros {
  S8_DATE_TIME_UTC = "S8_DATE_TIME_UTC",
}

/**
 * A set of supported `Data Manager Macros` for `Integer` values.
 */
export enum DataManagerIntegerMacros {
  S8_RANDOM_INTEGER = "S8_RANDOM_INTEGER",
  S8_TIME_STAMP_UTC = "S8_TIME_STAMP_UTC",
}

/**
 * A set of supported `Data Manager Macros` for `String` values.
 */
export enum DataManagerStringMacros {
  S8_BROWSER_MINOR_VERSION = "S8_BROWSER_MINOR_VERSION",
  S8_BROWSER_NAME = "S8_BROWSER_NAME",
  S8_BROWSER_VERSION = "S8_BROWSER_VERSION",
  S8_DATE_TIME_UTC = "S8_DATE_TIME_UTC",
  S8_DEVICE_BRAND = "S8_DEVICE_BRAND",
  S8_DEVICE_MODEL = "S8_DEVICE_MODEL",
  S8_DEVICE_NAME = "S8_DEVICE_NAME",
  S8_INGEST_ENDPOINT_ID = "S8_INGEST_ENDPOINT_ID",
  S8_INGEST_ENV_ID = "S8_INGEST_ENV_ID",
  S8_INGEST_REVISION_ID = "S8_INGEST_REVISION_ID",
  S8_ORG_ID = "S8_ORG_ID",
  S8_OS_MINOR_VERSION = "S8_OS_MINOR_VERSION",
  S8_OS_NAME = "S8_OS_NAME",
  S8_OS_PATCH_VERSION = "S8_OS_PATCH_VERSION",
  S8_OS_VERSION = "S8_OS_VERSION",
  S8_USER_AGENT = "S8_USER_AGENT",
  S8_USER_COUNTRY_CODE = "S8_USER_COUNTRY_CODE",
  S8_USER_HASH = "S8_USER_HASH",
  S8_USER_IP = "S8_USER_IP",
}

/**
 * A set of supported `Data Manager Macros` for `Timestamp` values.
 */
export enum DataManagerTimestampMacros {
  S8_TIME_STAMP_UTC = "S8_TIME_STAMP_UTC",
}

/**
 * A set of supported `GQLMethod`s used by `Audit`
 */
export enum GQLMethod {
  ADD_LINKED_ENTITY = "ADD_LINKED_ENTITY",
  AUTO_MERGE = "AUTO_MERGE",
  CREATE = "CREATE",
  DELETE = "DELETE",
  DELETE_LINKED_ENTITY = "DELETE_LINKED_ENTITY",
  DUPLICATE = "DUPLICATE",
  FINALIZE_REVISION = "FINALIZE_REVISION",
  INDIRECT_METHOD = "INDIRECT_METHOD",
  PUBLISH_PLATFORM = "PUBLISH_PLATFORM",
  REORDER_LINKED_ENTITIES = "REORDER_LINKED_ENTITIES",
  UPDATE_PROPERTIES = "UPDATE_PROPERTIES",
}

/**
 * A set of supported `IngestSchemaWizard` types.
 */
export enum IngestSchemaWizard {
  ERROR_TRACKING = "ERROR_TRACKING",
  USER_TRACKING = "USER_TRACKING",
}

/**
 * A set of supported `InputType`s for use with `PlatformDataMap`s
 */
export enum InputType {
  BOOLEAN_INPUT = "BOOLEAN_INPUT",
  CHECKBOX = "CHECKBOX",
  COLOR = "COLOR",
  CONSENT_PURPOSES = "CONSENT_PURPOSES",
  CONSENT_VENDORS = "CONSENT_VENDORS",
  COUNTRY_CODE_SELECT = "COUNTRY_CODE_SELECT",
  CSS = "CSS",
  DATETIME_STAMP = "DATETIME_STAMP",
  DATETIME_STRING = "DATETIME_STRING",
  DATE_STAMP = "DATE_STAMP",
  DATE_STRING = "DATE_STRING",
  DOM_SELECTOR_INPUT = "DOM_SELECTOR_INPUT",
  EMAIL = "EMAIL",
  ENVIRONMENT_SELECT = "ENVIRONMENT_SELECT",
  FLOAT_ARRAY_INPUT = "FLOAT_ARRAY_INPUT",
  FLOAT_INPUT = "FLOAT_INPUT",
  GENERIC_CONDITION = "GENERIC_CONDITION",
  HTML = "HTML",
  INGEST_ENDPOINT_PAYLOAD_DESIGNER = "INGEST_ENDPOINT_PAYLOAD_DESIGNER",
  INT_ARRAY_INPUT = "INT_ARRAY_INPUT",
  INT_INPUT = "INT_INPUT",
  JAVASCRIPT = "JAVASCRIPT",
  JSON = "JSON",
  MULTIPLE_SELECT = "MULTIPLE_SELECT",
  NUMBER_CONDITION = "NUMBER_CONDITION",
  OBJECT_ARRAY_INPUT = "OBJECT_ARRAY_INPUT",
  OBJECT_INPUT = "OBJECT_INPUT",
  RADIO = "RADIO",
  REVISION_SELECT = "REVISION_SELECT",
  SELECT = "SELECT",
  STRING_CONDITION = "STRING_CONDITION",
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  TEXTAREA_ARRAY_INPUT = "TEXTAREA_ARRAY_INPUT",
  TEXT_ARRAY_INPUT = "TEXT_ARRAY_INPUT",
  TEXT_WITH_MACRO_SUPPORT = "TEXT_WITH_MACRO_SUPPORT",
  URL = "URL",
  URL_WITH_MACRO_SUPPORT = "URL_WITH_MACRO_SUPPORT",
}

/**
 * Application mode.
 */
export enum Mode {
  COMMERCIAL = "COMMERCIAL",
  SELF_HOSTED = "SELF_HOSTED",
}

/**
 * A set of supported `Notification` types.
 */
export enum NotificationType {
  WELCOME = "WELCOME",
}

/**
 * A set of supported `OperationOwner`s used by `Audit`
 */
export enum OperationOwner {
  SYSTEM = "SYSTEM",
  USER = "USER",
}

/**
 * A set of supported `PlatformActionPermissionRequest`s used by `PlatformActionPermission`
 */
export enum PlatformActionPermissionRequest {
  COOKIE = "COOKIE",
  CREATE_IFRAME = "CREATE_IFRAME",
  DATA_LAYER = "DATA_LAYER",
  EMIT_EVENT = "EMIT_EVENT",
  GLOBAL_VARIABLE = "GLOBAL_VARIABLE",
  IMAGE_PIXEL = "IMAGE_PIXEL",
  INJECT_JAVASCRIPT = "INJECT_JAVASCRIPT",
  LISTEN_EVENT = "LISTEN_EVENT",
  LOCAL_STORAGE = "LOCAL_STORAGE",
  LOG_TO_CONSOLE = "LOG_TO_CONSOLE",
  READ_DOCUMENT_CHARACTER_SET = "READ_DOCUMENT_CHARACTER_SET",
  READ_PAGE_TITLE = "READ_PAGE_TITLE",
  READ_PAGE_URL = "READ_PAGE_URL",
  READ_REFERRER_URL = "READ_REFERRER_URL",
}

/**
 * A set of supported `PlatformActionPermissionURLParts`s used by `PlatformActionPermission`
 */
export enum PlatformActionPermissionURLParts {
  FRAGMENT = "FRAGMENT",
  HOST = "HOST",
  PATH = "PATH",
  PROTOCOL = "PROTOCOL",
  QUERY = "QUERY",
}

/**
 * A set of supported `PlatformTypes`s used by `Platform`
 */
export enum PlatformType {
  CUSTOM = "CUSTOM",
  TEMPLATED = "TEMPLATED",
}

/**
 * A set of supported `RevisionEntityParentType`s for use with `ActionGroupDistribution`s and `Trigger`s
 */
export enum RevisionEntityParentType {
  REVISION = "REVISION",
  RULE = "RULE",
}

/**
 * To be used with `SignUpRequest`, these are the valid signup types currently supported.
 */
export enum SignUpType {
  DATA_MANAGER = "DATA_MANAGER",
  INVITE = "INVITE",
  TAG_MANAGER = "TAG_MANAGER",
}

/**
 * A set of supported storage providers for use with `TrackedEnvironment`s
 */
export enum StorageProvider {
  AWS_KINESIS = "AWS_KINESIS",
  AWS_S3 = "AWS_S3",
  GC_BIGQUERY_STREAM = "GC_BIGQUERY_STREAM",
  MONGODB = "MONGODB",
}

/**
 * A tag can either be a `HEAD` tag or `PLACEMENT` tag, but can't be both. Please
 * take a look at the descriptions of each below and select the one that fits your use case.
 */
export enum TagType {
  HEAD = "HEAD",
  PLACEMENT = "PLACEMENT",
}

export enum TimeSlice {
  DAY = "DAY",
  HOUR = "HOUR",
  MINUTE = "MINUTE",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

/**
 * A set of supported `TypeIcon`s used by `Platform` entities
 */
export enum TypeIcon {
  ADD_ACTION = "ADD_ACTION",
  BROWSER_DATA_CONTAINER = "BROWSER_DATA_CONTAINER",
  BROWSER_EVENT = "BROWSER_EVENT",
  CHECKBOX = "CHECKBOX",
  CODE = "CODE",
  CODE_ACTION = "CODE_ACTION",
  CODE_EVENT = "CODE_EVENT",
  COLOR = "COLOR",
  DATA_ACTION = "DATA_ACTION",
  DATE = "DATE",
  DEFAULT = "DEFAULT",
  DEFAULT_ACTION = "DEFAULT_ACTION",
  DEFAULT_DATA_CONTAINER = "DEFAULT_DATA_CONTAINER",
  DEFAULT_DATA_MAP = "DEFAULT_DATA_MAP",
  DEFAULT_EVENT = "DEFAULT_EVENT",
  DELETE_ACTION = "DELETE_ACTION",
  ENVIRONMENT_DATA_CONTAINER = "ENVIRONMENT_DATA_CONTAINER",
  GEO = "GEO",
  LIST = "LIST",
  LOG_ACTION = "LOG_ACTION",
  NUMBER = "NUMBER",
  OBJECT = "OBJECT",
  OBJECTS = "OBJECTS",
  PAGE_EVENT = "PAGE_EVENT",
  PLATFORM_DATA_CONTAINER = "PLATFORM_DATA_CONTAINER",
  PULL_ACTION = "PULL_ACTION",
  PUSH_ACTION = "PUSH_ACTION",
  RADIO = "RADIO",
  RESET_ACTION = "RESET_ACTION",
  SELECTOR = "SELECTOR",
  SYNC_ACTION = "SYNC_ACTION",
  TAG_EVENT = "TAG_EVENT",
  TEXT = "TEXT",
  UPDATE_ACTION = "UPDATE_ACTION",
  USER_ACTION = "USER_ACTION",
  VISUAL_ACTION = "VISUAL_ACTION",
}

/**
 * A set of supported `ValidationType`s used by `PlatformDataMap` entities
 */
export enum ValidationType {
  VALID_NUMBER_MAX = "VALID_NUMBER_MAX",
  VALID_NUMBER_MIN = "VALID_NUMBER_MIN",
  VALID_REGEX = "VALID_REGEX",
  VALID_STRING_MAX_LENGTH = "VALID_STRING_MAX_LENGTH",
  VALID_STRING_MIN_LENGTH = "VALID_STRING_MIN_LENGTH",
}

/**
 * A set of supported `VarType`s for use with `DataMap`s and `PlatformDataMap`s
 */
export enum VarType {
  ARRAY_FLOAT = "ARRAY_FLOAT",
  ARRAY_INT = "ARRAY_INT",
  ARRAY_OBJECT = "ARRAY_OBJECT",
  ARRAY_STRING = "ARRAY_STRING",
  BOOLEAN = "BOOLEAN",
  DATETIME = "DATETIME",
  FLOAT = "FLOAT",
  INT = "INT",
  NULL = "NULL",
  OBJECT = "OBJECT",
  STRING = "STRING",
  TIMESTAMP = "TIMESTAMP",
}

/**
 * In order to use AWS Kinesis as your storage engine, you will need to create an
 * AWS account and create a new service account for Scale8. Please see our
 * documentation on how to configure this.
 */
export interface AWSKinesisConfig {
  access_key_id: string;
  secret_access_key: string;
  region: AWSRegion;
  stream_name: string;
}

/**
 * In order to use AWS S3 as your storage engine, you will need to create an AWS
 * account and create a new service account for Scale8. Please see our
 * documentation on how to configure this.
 */
export interface AWSStorageConfig {
  access_key_id: string;
  secret_access_key: string;
  region: AWSRegion;
  path_prefix?: string | null;
  bucket_name: string;
}

export interface AccountSubscribeInput {
  org_id: string;
  product_id: string;
  success_url: string;
  cancel_url: string;
  product?: AccountProduct | null;
}

export interface AccountUnsubscribeInput {
  org_id: string;
  product?: AccountProduct | null;
}

export interface ActionCreateInput {
  action_group_id: string;
  name: string;
  platform_action_id: string;
  data_maps: DataMapInput[];
  comments?: string | null;
}

export interface ActionDeleteInput {
  action_id: string;
  comments?: string | null;
}

export interface ActionGroupCreateInput {
  action_group_distribution_id: string;
  name: string;
  distribution?: number | null;
  is_locked?: boolean | null;
  comments?: string | null;
}

export interface ActionGroupDeleteInput {
  action_group_id: string;
  preview?: boolean | null;
  comments?: string | null;
}

/**
 * Only one attachment point should be provided for the action group distribution. Either a rule_id or a revision_id, not both.
 */
export interface ActionGroupDistributionCreateInput {
  rule_id?: string | null;
  revision_id?: string | null;
  name: string;
  action_group_distribution_type: ActionGroupDistributionType;
  comments?: string | null;
}

export interface ActionGroupDistributionDeleteInput {
  action_group_distribution_id: string;
  preview?: boolean | null;
  comments?: string | null;
}

export interface ActionGroupDistributionDuplicateInput {
  action_group_distribution_id: string;
  name: string;
}

export interface ActionGroupDistributionOrderInput {
  action_group_distribution_id: string;
  new_order: string[];
}

export interface ActionGroupDistributionUpdateInput {
  action_group_distribution_id: string;
  name?: string | null;
  comments?: string | null;
}

export interface ActionGroupDuplicateInput {
  action_group_id: string;
  name: string;
}

export interface ActionGroupOrderInput {
  action_group_id: string;
  new_order: string[];
}

export interface ActionGroupUpdateInput {
  action_group_id: string;
  name?: string | null;
  distribution?: number | null;
  is_locked?: boolean | null;
  comments?: string | null;
}

export interface ActionUpdateInput {
  action_id: string;
  name?: string | null;
  data_maps?: DataMapInput[] | null;
  comments?: string | null;
}

export interface AddChildrenIngestEndpointDataMapsInput {
  ingest_endpoint_data_map_id: string;
  ingest_endpoint_data_maps: IngestEndpointDataMapInput[];
}

export interface AppCreateInput {
  tag_manager_account_id: string;
  name: string;
  domain: string;
  type: AppType;
  storage_provider?: StorageProvider | null;
  storage_backend?: StorageBackend | null;
  analytics_enabled: boolean;
  error_tracking_enabled: boolean;
}

export interface AppDeleteInput {
  app_id: string;
}

export interface AppInstallPlatformInput {
  app_id: string;
  platform_id: string;
}

/**
 * Parameters required to link a `PlatformRevision` with a `Revision`. The
 * 'data_maps' provided are used to implement the `Platform` settings of the `Platform`.
 */
export interface AppPlatformRevisionLinkInput {
  revision_id: string;
  platform_revision_id: string;
  data_maps: DataMapInput[];
  preview?: boolean | null;
}

export interface AppPlatformRevisionUnlinkInput {
  app_platform_revision_id: string;
  preview?: boolean | null;
}

export interface AppQueryFilterOptions {
  from: S8DateTime;
  to: S8DateTime;
  revision?: string | null;
  environment?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  country?: string | null;
  referrer?: string | null;
  referrer_tld?: string | null;
  page?: string | null;
  mobile?: boolean | null;
  browser?: string | null;
  os?: string | null;
  event?: string | null;
  event_group?: string | null;
  custom_release_id?: string | null;
  error_id?: string | null;
  error_file?: string | null;
  error_message?: string | null;
}

export interface AppQueryOptions {
  time_slice?: TimeSlice | null;
  filter_options: AppQueryFilterOptions;
  limit?: number | null;
}

/**
 * Update an `App`'s properties. Please note that `AppType` can't be changed once a tag has been created.
 */
export interface AppUpdateInput {
  app_id: string;
  name?: string | null;
  domain?: string | null;
  storage_provider?: StorageProvider | null;
  storage_backend?: StorageBackend | null;
  analytics_enabled: boolean;
  error_tracking_enabled: boolean;
}

export interface BillingPortalInput {
  org_id: string;
  return_url: string;
}

export interface ChangePasswordInput {
  old_password?: string | null;
  new_password?: string | null;
}

export interface CompleteSignUpInput {
  sign_up_type: SignUpType;
  token: string;
}

/**
 * Either 'match' or 'match_id' must be provided. See `ConditionMatch` for more information.
 */
export interface ConditionRuleCreateInput {
  condition_mode: ConditionMode;
  trigger_id: string;
  platform_data_container_id: string;
  name: string;
  match?: string | null;
  match_key?: string | null;
  match_id?: string | null;
  match_condition: ConditionType;
  match_value: S8DataMapValue;
  comments?: string | null;
}

export interface ConditionRuleDeleteInput {
  condition_rule_id: string;
  comments?: string | null;
}

/**
 * Either 'match' or 'match_id' must be provided when updating a match value. See `ConditionMatch` for more information.
 */
export interface ConditionRuleUpdateInput {
  condition_rule_id: string;
  name?: string | null;
  match?: string | null;
  match_id?: string | null;
  match_key?: string | null;
  match_condition?: ConditionType | null;
  match_value?: S8DataMapValue | null;
  comments?: string | null;
}

export interface CreateFirstOrgInput {
  org_name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface DataMapInput {
  key: string;
  var_type: VarType;
  value?: S8DataMapValue | null;
  values?: S8DataMapValue[] | null;
  children?: DataMapInput[] | null;
  repeated_children?: (DataMapInput[] | null)[] | null;
}

export interface DeleteChildIngestEndpointDataMapInput {
  ingest_endpoint_data_map_id: string;
}

export interface DismissNotificationInput {
  notification_id: string;
}

/**
 * Data structure for duplicating an existing revision. This will clone the entire
 * structure and change the name if 'new_name' is provided.
 */
export interface DuplicateIngestEndpointRevisionInput {
  ingest_endpoint_revision_id: string;
  new_name?: string | null;
}

export interface DuplicatePlatformRevisionInput {
  platform_revision_id: string;
  new_name?: string | null;
}

export interface DuplicateRevisionInput {
  revision_id: string;
  new_name?: string | null;
}

export interface EnvironmentCreateInput {
  app_id: string;
  revision_id: string;
  name: string;
  url?: string | null;
  env_vars?: EnvironmentVariableInput[] | null;
  comments?: string | null;
}

export interface EnvironmentDeleteInput {
  environment_id: string;
}

/**
 * Update an `Environment`'s properties
 */
export interface EnvironmentUpdateInput {
  environment_id: string;
  revision_id?: string | null;
  name?: string | null;
  url?: string | null;
  custom_domain?: string | null;
  cert_pem?: string | null;
  key_pem?: string | null;
  comments?: string | null;
}

export interface EnvironmentVariableAddInput {
  environment_id: string;
  key: string;
  value: string;
}

export interface EnvironmentVariableDeleteInput {
  environment_id: string;
  key: string;
}

export interface EnvironmentVariableInput {
  key: string;
  value: string;
}

/**
 * Either 'browser_event' or 'platform_event_id' is required.
 */
export interface EventCreateInput {
  trigger_id: string;
  name?: string | null;
  browser_event?: string | null;
  platform_event_id?: string | null;
  data_maps: DataMapInput[];
  clear_state_ms?: number | null;
  comments?: string | null;
}

export interface EventDeleteInput {
  event_id: string;
  comments?: string | null;
}

export interface EventUpdateInput {
  event_id: string;
  name?: string | null;
  data_maps?: DataMapInput[] | null;
  clear_state_ms?: number | null;
  comments?: string | null;
}

/**
 * Data structure for finalising a revision. This action is final and can't be
 * undone. Once locked the revision can be attached to an environment.
 */
export interface FinaliseIngestEndpointRevisionInput {
  ingest_endpoint_revision_id: string;
}

export interface FinaliseRevisionInput {
  revision_id: string;
}

/**
 * BigQuery stream configuration required a Google Cloud Services account to be
 * setup and configured. PLease follow our guide and configure this properly before
 * attempting to use this service.
 */
export interface GCBigQueryStreamConfig {
  service_account_json: S8JSON;
  data_set_name: string;
  data_set_location?: string | null;
  require_partition_filter_in_queries?: boolean | null;
}

export interface GlobalActionGroupDistributionLinkInput {
  rule_id: string;
  global_action_group_distribution_id: string;
  comments?: string | null;
}

export interface GlobalActionGroupDistributionUnlinkInput {
  rule_id: string;
  global_action_group_distribution_id: string;
  comments?: string | null;
}

/**
 * Data structure for creating new data maps and linking this directly the the
 * revision. To add a child data map, this will need to be attached directly to the
 * parent. Please see `IngestEndpointDataMap`.
 */
export interface IngestEndpointAddIngestEndpointDataMapsInput {
  ingest_endpoint_revision_id: string;
  ingest_endpoint_data_maps: IngestEndpointDataMapInput[];
}

/**
 * Data structure for creating a new `IngestEndpoint`. This new entity is then used to contain both revisions and environments.
 */
export interface IngestEndpointCreateInput {
  data_manager_account_id: string;
  name: string;
  ingest_schema_wizard?: IngestSchemaWizard | null;
  storage_provider?: StorageProvider | null;
  storage_backend?: StorageBackend | null;
  analytics_enabled: boolean;
}

export interface IngestEndpointDataMapInput {
  key: string;
  var_type: VarType;
  default_value?: S8DataMapValue | null;
  default_values?: S8DataMapValue[] | null;
  child_ingest_endpoint_data_maps?: IngestEndpointDataMapInput[] | null;
  optional?: boolean | null;
  validation_rules?: IngestEndpointDataMapValidationInput[] | null;
}

export interface IngestEndpointDataMapUpdateInput {
  ingest_endpoint_data_map_id: string;
  remove_default_value?: boolean | null;
  default_value?: S8DataMapValue | null;
  default_values?: S8DataMapValue[] | null;
  optional?: boolean | null;
  validation_rules?: IngestEndpointDataMapValidationInput[] | null;
}

export interface IngestEndpointDataMapValidationInput {
  type: ValidationType;
  input_value?: S8DataMapValue | null;
}

/**
 * Data structure for deleting an existing `IngestEndpoint`. It will remove all
 * child entities, however no attempt will be made to clean any data from your
 * storage engines / streams that are linked at the environment level. There is no
 * flag supposed to clean up data in your services.
 */
export interface IngestEndpointDeleteInput {
  ingest_endpoint_id: string;
}

/**
 * Multiple deployments can be configured here, the same `IngestEndpoint` can be
 * configured to work with different engines and adapted to your own specific use
 * cases. A storage engine must be provided however to successfully create and
 * configure and new environment.
 */
export interface IngestEndpointEnvironmentCreateInput {
  ingest_endpoint_id: string;
  name: string;
  custom_domain?: string | null;
  cert_pem?: string | null;
  key_pem?: string | null;
  storage_provider: StorageProvider;
  ingest_endpoint_revision_id: string;
  storage_backend?: StorageBackend | null;
}

/**
 * Deleting an environment will remove the deployment permanently. It will not
 * delete the information from your storage/stream engines however. We will make no
 * attempt to clean and data from your cloud services.
 */
export interface IngestEndpointEnvironmentDeleteInput {
  ingest_endpoint_environment_id: string;
}

/**
 * We do not currently allow changes to a storage engine to be made, doing so could
 * cause a number of potential issues. If you find yourself requiring any
 * assistance, please contact us and we'll do our best to support your setup issues.
 */
export interface IngestEndpointEnvironmentUpdateInput {
  ingest_endpoint_environment_id: string;
  ingest_endpoint_revision_id?: string | null;
  name?: string | null;
  custom_domain?: string | null;
  cert_pem?: string | null;
  key_pem?: string | null;
  storage_backend?: StorageBackend | null;
}

/**
 * Data structure for updating a revision. The only property that can be changed directly is the name of the revision.
 */
export interface IngestEndpointRevisionUpdateInput {
  ingest_endpoint_revision_id: string;
  name?: string | null;
}

/**
 * Data structure for updating of properties associated with this entity.
 */
export interface IngestEndpointUpdateInput {
  ingest_endpoint_id: string;
  name?: string | null;
  storage_provider?: StorageProvider | null;
  storage_backend?: StorageBackend | null;
  analytics_enabled: boolean;
}

/**
 * Options to add filter values on IngestQueryOptions.
 */
export interface IngestQueryFilterOptions {
  from: S8DateTime;
  to: S8DateTime;
  revision?: string | null;
  environment?: string | null;
}

/**
 * Options to query stats.
 */
export interface IngestQueryOptions {
  time_slice?: TimeSlice | null;
  filter_options: IngestQueryFilterOptions;
  limit?: number | null;
}

export interface Login2FAInput {
  uid: string;
  temp_token: string;
  code: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface MeUpdateInput {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  email_notifications?: boolean | null;
}

/**
 * In order to use MongoDB as your storage engine, you just need to provide connection string and database name.
 */
export interface MongoDbPushConfig {
  use_api_mongo_server: boolean;
  connection_string?: string | null;
  database_name?: string | null;
}

export interface OrgAcceptInviteInput {
  invite_id: string;
}

export interface OrgAddUserInput {
  org_id: string;
  email: string;
  first_name: string;
  last_name: string;
  org_permission_group: OrgPermissionGroupInput;
}

export interface OrgCancelInviteInput {
  invite_id: string;
  org_id: string;
}

export interface OrgCreateInput {
  name: string;
  comments?: string | null;
}

export interface OrgDeclineInviteInput {
  invite_id: string;
}

export interface OrgDeleteInput {
  id: string;
  comments?: string | null;
}

export interface OrgInviteUserInput {
  org_id: string;
  email: string;
  org_permission_group: OrgPermissionGroupInput;
}

export interface OrgPermissionGroupInput {
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  is_admin: boolean;
}

export interface OrgRemoveMeInput {
  org_id: string;
}

export interface OrgRemoveUserInput {
  org_id: string;
  user_id: string;
}

export interface OrgUpdateInput {
  id: string;
  name?: string | null;
  comments?: string | null;
}

export interface OrgUpdateUserInput {
  org_id: string;
  user_id: string;
  permission_group: OrgPermissionGroupInput;
}

export interface PlatformActionPermissionTemplatedCreateInput {
  permission: PlatformActionPermissionRequest;
  variable_read_write_execute_scopes?: VariableReadWriteExecuteScopeInput[] | null;
  url_parts?: PlatformActionPermissionURLParts[] | null;
  host_matches?: string[] | null;
  event_names?: string[] | null;
}

export interface PlatformActionTemplatedCreateInput {
  platform_revision_id: string;
  name: string;
  description: string;
  icon?: TypeIcon | null;
  code: string;
  platform_data_maps?: PlatformActionTemplatedDataMapCreateInput[] | null;
  permission_requests?: PlatformActionPermissionTemplatedCreateInput[] | null;
  exec_raw_in_iframe?: boolean | null;
}

export interface PlatformActionTemplatedDataMapCreateInput {
  key: string;
  description?: string | null;
  icon?: TypeIcon | null;
  input_type: InputType;
  default_value?: S8DataMapValue | null;
  default_values?: S8DataMapValue[] | null;
  option_values?: S8DataMapValue[] | null;
  child_platform_data_maps?: PlatformActionTemplatedDataMapCreateInput[] | null;
  optional?: boolean | null;
  validation_rules?: PlatformDataMapValidationInput[] | null;
}

export interface PlatformActionTemplatedDeleteInput {
  platform_action_id: string;
}

export interface PlatformActionTemplatedUpdateInput {
  platform_action_id: string;
  name?: string | null;
  description?: string | null;
  icon?: TypeIcon | null;
  code?: string | null;
  platform_data_maps?: PlatformActionTemplatedDataMapCreateInput[] | null;
  permission_requests?: PlatformActionPermissionTemplatedCreateInput[] | null;
  comments?: string | null;
}

export interface PlatformCreateInput {
  type: PlatformType;
  tag_manager_account_id: string;
  name: string;
  description: string;
}

export interface PlatformDataMapValidationInput {
  type: ValidationType;
  input_value?: S8DataMapValue | null;
}

export interface PlatformPublishInput {
  platform_id: string;
}

export interface PlatformUpdateInput {
  platform_id: string;
  name?: string | null;
  description?: string | null;
}

export interface PublishPlatformRevisionInput {
  platform_revision_id: string;
}

export interface RegenerateUserPasswordInput {
  org_id: string;
  user_id: string;
}

export interface ResetPasswordInput {
  token: string;
  new_password: string;
}

/**
 * Update a `PlatformRevision`'s properties
 */
export interface RevisionPlatformUpdateInput {
  platform_revision_id: string;
  name?: string | null;
  comments?: string | null;
}

/**
 * Update a `Revision`'s properties
 */
export interface RevisionUpdateInput {
  revision_id: string;
  name?: string | null;
  comments?: string | null;
}

export interface RuleCreateInput {
  rule_group_id: string;
  global_trigger_id?: string | null;
  name: string;
  min_repeat_interval?: number | null;
  comments?: string | null;
}

export interface RuleDeleteInput {
  rule_id: string;
  preview?: boolean | null;
  comments?: string | null;
}

export interface RuleDuplicateInput {
  rule_id: string;
  name: string;
}

export interface RuleGroupCreateInput {
  tag_id: string;
  name: string;
  comments?: string | null;
}

export interface RuleGroupDeleteInput {
  rule_group_id: string;
  preview?: boolean | null;
  comments?: string | null;
}

export interface RuleGroupDuplicateInput {
  rule_group_id: string;
  name: string;
}

export interface RuleGroupRuleOrderInput {
  rule_group_id: string;
  new_order: string[];
}

export interface RuleGroupUpdateInput {
  rule_group_id: string;
  name?: string | null;
  is_active?: boolean | null;
  comments?: string | null;
}

export interface RuleOrderInput {
  rule_id: string;
  new_order: string[];
}

export interface RuleUpdateInput {
  rule_id: string;
  name?: string | null;
  is_active?: boolean | null;
  min_repeat_interval?: number | null;
  comments?: string | null;
}

export interface SendPasswordResetInput {
  email: string;
}

export interface SignUpInput {
  sign_up_type: SignUpType;
  full_name: string;
  captcha_token: string;
  temp_access_code: string;
  email?: string | null;
  domain?: string | null;
  org_name?: string | null;
  password?: string | null;
  invite_id?: string | null;
}

export interface StartDataManagerTrialInput {
  org_id: string;
}

export interface StartTagManagerTrialInput {
  org_id: string;
}

export interface StorageBackend {
  aws_storage_config?: AWSStorageConfig | null;
  aws_kinesis_config?: AWSKinesisConfig | null;
  gc_bigquery_stream_config?: GCBigQueryStreamConfig | null;
  mongo_push_config?: MongoDbPushConfig | null;
}

export interface TagCreateInput {
  revision_id: string;
  name: string;
  type: TagType;
  width?: number | null;
  height?: number | null;
  auto_load?: boolean | null;
  comments?: string | null;
}

export interface TagDeleteInput {
  tag_id: string;
  preview?: boolean | null;
  comments?: string | null;
}

export interface TagDuplicateInput {
  tag_id: string;
  name: string;
}

export interface TagRuleGroupOrderInput {
  tag_id: string;
  new_order: string[];
}

/**
 * Update a `Tag`'s properties. Please note that `TagType` can't be changed once a tag has been created.
 */
export interface TagUpdateInput {
  tag_id: string;
  name?: string | null;
  is_active?: boolean | null;
  width?: number | null;
  height?: number | null;
  auto_load?: boolean | null;
  comments?: string | null;
}

export interface TransferOwnershipInput {
  org_id: string;
  user_id: string;
}

/**
 * A `Trigger` can only be created on a `Revision`. A `Rule` has an immutable, persistant `Trigger` associated with it.
 */
export interface TriggerCreateInput {
  revision_id: string;
  name: string;
  comments?: string | null;
}

export interface TriggerDeleteInput {
  trigger_id: string;
  preview?: boolean | null;
  comments?: string | null;
}

export interface TriggerDuplicateInput {
  trigger_id: string;
  name: string;
}

export interface TriggerUpdateInput {
  trigger_id: string;
  name?: string | null;
  comments?: string | null;
}

export interface TwoFactorAuthDisableInput {
  code: string;
}

export interface TwoFactorAuthEnableInput {
  code: string;
}

export interface VariableReadWriteExecuteScopeInput {
  name: string;
  read: boolean;
  write: boolean;
  execute: boolean;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
