import {
    PlatformActionPermissionRequest,
    PlatformActionPermissionURLParts,
} from '../gql/generated/globalTypes';

export type PlatformActionPermissionInput = {
    permission: PlatformActionPermissionRequest;
    variableReadWriteExecuteScopes?: VariableReadWriteExecuteScopeInput[];
    urlParts?: PlatformActionPermissionURLParts[];
    hostMatches?: string[];
    eventNames?: string[];
    active: boolean;
};

export type VariableReadWriteExecuteScopeInput = {
    name: string;
    read: boolean;
    write: boolean;
    execute: boolean;
};
