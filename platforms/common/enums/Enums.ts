export enum TagType {
    HEAD = 'HEAD',
    PLACEMENT = 'PLACEMENT',
}

export enum PlatformType {
    CUSTOM = 'CUSTOM',
    TEMPLATED = 'TEMPLATED',
}

export enum ActionGroupDistributionType {
    NONE = 'NONE', //no distribution of actions
    SESSION = 'SESSION', //distribute by session
    PAGE_LOAD = 'PAGE_LOAD', //distribute by page load
}

export enum PlatformActionPermissionRequest {
    GLOBAL_VARIABLE = 'GLOBAL_VARIABLE', //scope is on name + read / write flags (one or more)
    LOCAL_STORAGE = 'LOCAL_STORAGE', //scope is on name + read / write flags (one or more)
    COOKIE = 'COOKIE', //scope is on name + read / write flags
    DATA_LAYER = 'DATA_LAYER', //scope is on keys (always read only)
    READ_REFERRER_URL = 'READ_REFERRER_URL', //scope = protocol, host, path, query, fragment (one or more)
    READ_PAGE_URL = 'READ_PAGE_URL', //scope = protocol, host, path, query, fragment (one or more)
    CREATE_IFRAME = 'CREATE_IFRAME', //scope = match host. (one or more)
    INJECT_JAVASCRIPT = 'INJECT_JAVASCRIPT', //scope = match host. (one or more)
    IMAGE_PIXEL = 'IMAGE_PIXEL', //scope = match host. (one or more)
    LISTEN_EVENT = 'LISTEN_EVENT', //scope, event name.
    EMIT_EVENT = 'EMIT_EVENT', //scope, event name.
    READ_PAGE_TITLE = 'READ_PAGE_TITLE',
    LOG_TO_CONSOLE = 'LOG_TO_CONSOLE',
    READ_DOCUMENT_CHARACTER_SET = 'READ_DOCUMENT_CHARACTER_SET',
}

export enum PlatformActionPermissionURLParts {
    PROTOCOL = 'PROTOCOL',
    HOST = 'HOST',
    PATH = 'PATH',
    QUERY = 'QUERY',
    FRAGMENT = 'FRAGMENT',
}

export enum VarType {
    DATETIME = 'DATETIME',
    TIMESTAMP = 'TIMESTAMP',
    STRING = 'STRING',
    BOOLEAN = 'BOOLEAN',
    INT = 'INT',
    FLOAT = 'FLOAT',
    NULL = 'NULL',
    OBJECT = 'OBJECT',
    ARRAY_STRING = 'ARRAY_STRING',
    ARRAY_INT = 'ARRAY_INT',
    ARRAY_FLOAT = 'ARRAY_FLOAT',
    ARRAY_OBJECT = 'ARRAY_OBJECT',
}

export enum ConditionType {
    EQUAL = 'EQUAL',
    NOT_EQUAL = 'NOT_EQUAL',
    CONTAINS = 'CONTAINS',
    BEGINS_WITH = 'BEGINS_WITH',
    ENDS_WITH = 'ENDS_WITH',
    REGULAR_EXPRESSION = 'REGULAR_EXPRESSION',
    GREATER_THAN = 'GREATER_THAN',
    GREATER_THAN_EQUAL = 'GREATER_THAN_EQUAL',
    LESS_THAN = 'LESS_THAN',
    LESS_THAN_EQUAL = 'LESS_THAN_EQUAL',
    IS_DEFINED = 'IS_DEFINED',
    IS_NOT_DEFINED = 'IS_NOT_DEFINED',
}
