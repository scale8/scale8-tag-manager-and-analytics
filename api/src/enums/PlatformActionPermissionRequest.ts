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
