import { PlatformActionPermissionRequest } from '../gql/generated/globalTypes';
import { PlatformActionPermissionInput } from '../types/ActionPermissionsTypes';

const addActionPermission = (
    permissionRequests: PlatformActionPermissionInput[],
    permission: PlatformActionPermissionRequest,
): PlatformActionPermissionInput[] => {
    return [
        ...permissionRequests,
        {
            permission,
            active: true,
        },
    ];
};

const showActionPermission = (
    permissionRequests: PlatformActionPermissionInput[],
    permission: PlatformActionPermissionRequest,
): PlatformActionPermissionInput[] => {
    return permissionRequests.map((_) => {
        if (_.permission === permission) {
            return {
                ..._,
                active: true,
            };
        }
        return _;
    });
};

const hideActionPermission = (
    permissionRequests: PlatformActionPermissionInput[],
    permission: PlatformActionPermissionRequest,
): PlatformActionPermissionInput[] => {
    return permissionRequests.map((_) => {
        if (_.permission === permission) {
            return {
                ..._,
                active: false,
            };
        }
        return _;
    });
};

const onActionPermissionFound = (
    permissionRequests: PlatformActionPermissionInput[],
    permission: PlatformActionPermissionRequest,
): PlatformActionPermissionInput[] => {
    const existingPermission = permissionRequests.find((_) => _.permission === permission);
    if (existingPermission === undefined) {
        return addActionPermission(permissionRequests, permission);
    }
    return showActionPermission(permissionRequests, permission);
};

const onActionPermissionNotFound = (
    permissionRequests: PlatformActionPermissionInput[],
    permission: PlatformActionPermissionRequest,
): PlatformActionPermissionInput[] => {
    const existingPermission = permissionRequests.find((_) => _.permission === permission);
    if (existingPermission !== undefined) {
        return hideActionPermission(permissionRequests, permission);
    }
    return permissionRequests;
};

const actionPermissionsFromCode = (
    enabled: boolean,
    code: string,
    permissionRequests: PlatformActionPermissionInput[],
): PlatformActionPermissionInput[] => {
    if (!enabled) {
        return [];
    }
    const requireMatches = Array.from(code.matchAll(/require\(["']([a-z0-9]+)["']\)/gi)).map(
        (_) => _[1],
    );

    const targets: {
        targetMatch: string;
        targetPermission: PlatformActionPermissionRequest;
    }[] = [
        {
            targetMatch: 'WindowVariableAlias',
            targetPermission: PlatformActionPermissionRequest.GLOBAL_VARIABLE,
        },
        {
            targetMatch: 'WindowCallFunction',
            targetPermission: PlatformActionPermissionRequest.GLOBAL_VARIABLE,
        },
        {
            targetMatch: 'WindowVariableCopy',
            targetPermission: PlatformActionPermissionRequest.GLOBAL_VARIABLE,
        },
        {
            targetMatch: 'WindowCreateQueue',
            targetPermission: PlatformActionPermissionRequest.GLOBAL_VARIABLE,
        },
        {
            targetMatch: 'WindowVariableSet',
            targetPermission: PlatformActionPermissionRequest.GLOBAL_VARIABLE,
        },
        {
            targetMatch: 'CustomDataLayerVariableCopy',
            targetPermission: PlatformActionPermissionRequest.DATA_LAYER,
        },
        {
            targetMatch: 'EmitEvent',
            targetPermission: PlatformActionPermissionRequest.EMIT_EVENT,
        },
        {
            targetMatch: 'GetCookie',
            targetPermission: PlatformActionPermissionRequest.COOKIE,
        },
        {
            targetMatch: 'SetCookie',
            targetPermission: PlatformActionPermissionRequest.COOKIE,
        },
        {
            targetMatch: 'ReferrerURL',
            targetPermission: PlatformActionPermissionRequest.READ_REFERRER_URL,
        },
        {
            targetMatch: 'WindowURL',
            targetPermission: PlatformActionPermissionRequest.READ_PAGE_URL,
        },
        {
            targetMatch: 'InjectHiddenFrame',
            targetPermission: PlatformActionPermissionRequest.CREATE_IFRAME,
        },
        {
            targetMatch: 'InjectScript',
            targetPermission: PlatformActionPermissionRequest.INJECT_JAVASCRIPT,
        },
        {
            targetMatch: 'GetLocalStorageItem',
            targetPermission: PlatformActionPermissionRequest.LOCAL_STORAGE,
        },
        {
            targetMatch: 'SetLocalStorageItem',
            targetPermission: PlatformActionPermissionRequest.LOCAL_STORAGE,
        },
        {
            targetMatch: 'RemoveLocalStorageItem',
            targetPermission: PlatformActionPermissionRequest.LOCAL_STORAGE,
        },
        {
            targetMatch: 'ConsoleLog',
            targetPermission: PlatformActionPermissionRequest.LOG_TO_CONSOLE,
        },
        {
            targetMatch: 'PageTitle',
            targetPermission: PlatformActionPermissionRequest.READ_PAGE_TITLE,
        },
        {
            targetMatch: 'SendPixel',
            targetPermission: PlatformActionPermissionRequest.IMAGE_PIXEL,
        },
    ];

    const initialPermissionsState = Object.keys(PlatformActionPermissionRequest).map(
        (permission) => ({ permission, found: false }),
    );

    const permissionState = targets.reduce((accumulator, currentValue) => {
        if (requireMatches.includes(currentValue.targetMatch)) {
            return accumulator.map((_) => {
                if (_.permission === currentValue.targetPermission) {
                    return { ..._, found: true };
                }
                return _;
            });
        }
        return accumulator;
    }, initialPermissionsState);

    return permissionState.reduce((accumulator, currentValue) => {
        if (currentValue.found) {
            return onActionPermissionFound(
                accumulator,
                currentValue.permission as PlatformActionPermissionRequest,
            );
        } else {
            return onActionPermissionNotFound(
                accumulator,
                currentValue.permission as PlatformActionPermissionRequest,
            );
        }
    }, permissionRequests);
};

export { actionPermissionsFromCode };
