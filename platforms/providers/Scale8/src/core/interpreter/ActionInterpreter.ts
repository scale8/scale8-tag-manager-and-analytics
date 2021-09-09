import { Interpreter } from '@scale8/s8-interpreter';
import ObjectReference from '../../../../../common/lib/util/ObjectReference';
import ObjectClone from '../../../../../common/lib/util/ObjectClone';
import URLParser from '../../../../../common/lib/util/URLParser';
import Loader from '../../../../../common/lib/util/Loader';
import Frame from '../../../../../common/lib/util/Frame';
import Logger from '../../../../../common/lib/util/Logger';
import Pixel from '../../../../../common/lib/util/Pixel';
import Wildcard from '../../../../../common/lib/util/Wildcard';
import Random from '../../../../../common/lib/util/Random';
import { getCookieItem, setCookieItem } from '../../../../../common/lib/util/Cookie';
import { PlatformActionPermission } from '../config/ModelTypes';
import { getTopWindow } from '../../../../../common/lib/util/WindowElement';
import {
    PlatformActionPermissionRequest,
    PlatformActionPermissionURLParts,
} from '../../../../../common/enums/Enums';

type VariableReadWriteExecuteScope = {
    name: string;
    read: boolean;
    write: boolean;
    execute: boolean;
};

export default class ActionInterpreter {
    private checkVariablePermissions(
        required: VariableReadWriteExecuteScope,
        has: VariableReadWriteExecuteScope,
    ): boolean {
        const convertPermissionToBinary = (p: VariableReadWriteExecuteScope): number =>
            (p.read ? 0b001 : 0b000) + (p.write ? 0b010 : 0b000) + (p.execute ? 0b100 : 0b000);
        return (convertPermissionToBinary(has) & convertPermissionToBinary(required)) > 0;
    }

    private satisfiesPermission(
        requiredPermission: PlatformActionPermissionRequest,
        requiredScope: {
            variableScope?: VariableReadWriteExecuteScope;
            urlParts?: PlatformActionPermissionURLParts | PlatformActionPermissionURLParts[];
            hostMatch?: string;
            eventName?: string;
        },
        permissions: PlatformActionPermission[],
    ): boolean {
        const permission = permissions.find((_) => _._permission === requiredPermission);

        if (permission !== undefined) {
            const variableReadWriteScopes =
                permission._variable_read_write_execute_scopes === null
                    ? []
                    : permission._variable_read_write_execute_scopes.map(
                          (_) => JSON.parse(_) as VariableReadWriteExecuteScope,
                      );
            const urlParts = permission._url_parts || [];
            const hostMatches = permission._host_matches || [];
            const eventNames = permission._event_names || [];

            if (requiredScope.variableScope !== undefined) {
                //we have to match this variable scope...
                return (
                    variableReadWriteScopes.find(
                        (_) =>
                            _.name === requiredScope.variableScope?.name &&
                            this.checkVariablePermissions(requiredScope.variableScope, _),
                    ) !== undefined
                );
            } else if (typeof requiredScope.urlParts === 'string') {
                return urlParts.indexOf(requiredScope.urlParts) > -1;
            } else if (Array.isArray(requiredScope.urlParts)) {
                return requiredScope.urlParts.every((_) => urlParts.indexOf(_) > -1);
            } else if (typeof requiredScope.hostMatch === 'string') {
                return (
                    hostMatches.find((_) => Wildcard.test(requiredScope.hostMatch as string, _)) !==
                    undefined
                );
            } else if (typeof requiredScope.eventName === 'string') {
                return (
                    eventNames.find((_) => Wildcard.test(requiredScope.eventName as string, _)) !==
                    undefined
                );
            } else {
                //permission found and no scoping requirements...
                return true;
            }
        } else {
            //no permission found...
            return false;
        }
    }

    public create(
        code: string,
        permissions: PlatformActionPermission[],
        actionData: { [k: string]: any },
        success: () => void,
        failure: (reason: string) => void,
        stdOut: (msg: string) => void,
        stdErr: (msg: string) => void,
    ): Interpreter {
        Logger.debug(code);
        const dataLayer = (getTopWindow() as any).customDataLayer;
        return new Interpreter(code, (interpreter, globalObject) => {
            interpreter.setProperty(
                globalObject,
                'require',
                interpreter.createNativeFunction((packageName: string) => {
                    switch (packageName) {
                        //Missing - https://developers.google.com/tag-manager/templates/api#addeventcallback
                        case 'EmitEvent': //does not map to GTM's version...
                            return interpreter.createNativeFunction((name: string) => {
                                if (
                                    this.satisfiesPermission(
                                        PlatformActionPermissionRequest.EMIT_EVENT,
                                        {
                                            eventName: name,
                                        },
                                        permissions,
                                    )
                                ) {
                                    const topWindow = getTopWindow();
                                    const evnt = getTopWindow().document.createEvent('Event');
                                    evnt.initEvent(name, true, true);
                                    topWindow.dispatchEvent(evnt);
                                } else {
                                    failure(
                                        `Unable to emit event '${name}', missing required permission`,
                                    );
                                }
                            });
                        case 'WindowVariableAlias': // https://developers.google.com/tag-manager/templates/api#aliasinwindow
                            return interpreter.createNativeFunction(
                                (currentPath: string, newPath: string) => {
                                    if (
                                        this.satisfiesPermission(
                                            PlatformActionPermissionRequest.GLOBAL_VARIABLE,
                                            {
                                                variableScope: {
                                                    name: currentPath,
                                                    read: true,
                                                    write: false,
                                                    execute: false,
                                                },
                                            },
                                            permissions,
                                        )
                                    ) {
                                        const topWindow = getTopWindow();
                                        const fromReference = ObjectReference.getReferenceFromPath(
                                            currentPath,
                                            topWindow,
                                        );
                                        if (
                                            this.satisfiesPermission(
                                                PlatformActionPermissionRequest.GLOBAL_VARIABLE,
                                                {
                                                    variableScope: {
                                                        name: currentPath,
                                                        read: true,
                                                        write: false,
                                                        execute: false,
                                                    },
                                                },
                                                permissions,
                                            )
                                        ) {
                                            return typeof fromReference !== 'undefined'
                                                ? ObjectReference.setValueFromPath(
                                                      newPath,
                                                      topWindow,
                                                      fromReference,
                                                      true,
                                                  )
                                                : false;
                                        } else {
                                            failure(
                                                `Unable to write to variable at ${newPath}, missing write permission`,
                                            );
                                            return false;
                                        }
                                    } else {
                                        failure(
                                            `Unable to read variable at ${currentPath}, missing read permission`,
                                        );
                                        return false;
                                    }
                                },
                            );
                        case 'WindowCallFunction': // https://developers.google.com/tag-manager/templates/api#callinwindow
                            return interpreter.createNativeFunction(
                                (path: string, ...args: any[]) => {
                                    if (
                                        this.satisfiesPermission(
                                            PlatformActionPermissionRequest.GLOBAL_VARIABLE,
                                            {
                                                variableScope: {
                                                    name: path,
                                                    read: false,
                                                    write: false,
                                                    execute: true,
                                                },
                                            },
                                            permissions,
                                        )
                                    ) {
                                        const topWindow = getTopWindow();
                                        const ref = ObjectReference.getReferenceFromPath(
                                            path,
                                            topWindow,
                                        );
                                        return typeof ref === 'function' ? ref(...args) : undefined;
                                    } else {
                                        failure(
                                            `Unable to call function at ${path}, missing execute permission`,
                                        );
                                        return undefined;
                                    }
                                },
                            );
                        case 'CallAsync': // https://developers.google.com/tag-manager/templates/api#calllater
                            return interpreter.createNativeFunction((f: any) => {
                                setTimeout(() => {
                                    interpreter.queueFunction(f, undefined);
                                    interpreter.run();
                                }, 0);
                            });
                        case 'CustomDataLayerVariableCopy': // https://developers.google.com/tag-manager/templates/api#copyfromdatalayer
                            return interpreter.createNativeFunction((path: string): any => {
                                if (
                                    this.satisfiesPermission(
                                        PlatformActionPermissionRequest.DATA_LAYER,
                                        {
                                            variableScope: {
                                                name: path,
                                                read: true,
                                                write: false,
                                                execute: false,
                                            },
                                        },
                                        permissions,
                                    )
                                ) {
                                    const ref = ObjectReference.getReferenceFromPath(
                                        path,
                                        dataLayer,
                                    );
                                    return typeof ref === 'undefined'
                                        ? undefined
                                        : interpreter.nativeToPseudo(ObjectClone.simple(ref));
                                } else {
                                    failure(
                                        `Unable to read variable at ${path}, missing read permission`,
                                    );
                                    return undefined;
                                }
                            });
                        case 'WindowVariableCopy': // https://developers.google.com/tag-manager/templates/api#copyfromwindow
                            return interpreter.createNativeFunction((path: string): any => {
                                if (
                                    this.satisfiesPermission(
                                        PlatformActionPermissionRequest.GLOBAL_VARIABLE,
                                        {
                                            variableScope: {
                                                name: path,
                                                read: true,
                                                write: false,
                                                execute: false,
                                            },
                                        },
                                        permissions,
                                    )
                                ) {
                                    const topWindow = getTopWindow();
                                    const ref = ObjectReference.getReferenceFromPath(
                                        path,
                                        topWindow,
                                    );
                                    return typeof ref === 'undefined'
                                        ? undefined
                                        : interpreter.nativeToPseudo(ObjectClone.simple(ref));
                                } else {
                                    failure(
                                        `Unable to read variable at ${path}, missing read permission`,
                                    );
                                    return undefined;
                                }
                            });
                        // Missing: https://developers.google.com/tag-manager/templates/api#createargumentsqueue
                        case 'WindowCreateQueue': // https://developers.google.com/tag-manager/templates/api#createqueue
                            return interpreter.createNativeFunction((path: string) => {
                                if (
                                    this.satisfiesPermission(
                                        PlatformActionPermissionRequest.GLOBAL_VARIABLE,
                                        {
                                            variableScope: {
                                                name: path,
                                                read: false,
                                                write: true,
                                                execute: false,
                                            },
                                        },
                                        permissions,
                                    )
                                ) {
                                    const topWindow = getTopWindow();
                                    const q = ObjectReference.getReferenceFromPath(path, topWindow);
                                    if (Array.isArray(q)) {
                                        return interpreter.createNativeFunction((...elms: any) => {
                                            q.push(
                                                ...elms.map((_: any) =>
                                                    interpreter.pseudoToNative(_),
                                                ),
                                            );
                                        });
                                    } else {
                                        const queue: any[] = [];
                                        ObjectReference.setValueFromPath(
                                            path,
                                            topWindow,
                                            queue,
                                            true,
                                        );
                                        return interpreter.createNativeFunction((...elms: any) => {
                                            queue.push(
                                                ...elms.map((_: any) =>
                                                    interpreter.pseudoToNative(_),
                                                ),
                                            );
                                        });
                                    }
                                } else {
                                    failure(
                                        `Unable to write to variable at ${path}, missing write permission`,
                                    );
                                    return () => {
                                        //no action.
                                    };
                                }
                            });
                        case 'DecodeURI': // https://developers.google.com/tag-manager/templates/api#decodeuri
                            return interpreter.createNativeFunction((encodedValue: string) => {
                                return interpreter.nativeToPseudo(decodeURI(encodedValue));
                            });
                        case 'DecodeURIComponent': // https://developers.google.com/tag-manager/templates/api#decodeuricomponent
                            return interpreter.createNativeFunction((encodedValue: string) => {
                                return interpreter.nativeToPseudo(decodeURIComponent(encodedValue));
                            });
                        case 'EncodeURI': // https://developers.google.com/tag-manager/templates/api#encodeuri
                            return interpreter.createNativeFunction((uri: string) => {
                                return interpreter.nativeToPseudo(encodeURI(uri));
                            });
                        case 'EncodeURIComponent': // https://developers.google.com/tag-manager/templates/api#encodeuricomponent
                            return interpreter.createNativeFunction((uriPart: string) => {
                                return interpreter.nativeToPseudo(encodeURIComponent(uriPart));
                            });
                        case 'Base64Encode': // https://developers.google.com/tag-manager/templates/api#tobase64
                            return interpreter.createNativeFunction((value: string) => {
                                return interpreter.nativeToPseudo(btoa(value));
                            });
                        case 'Base64Decode': // https://developers.google.com/tag-manager/templates/api#frombase64
                            return interpreter.createNativeFunction((value: string) => {
                                return interpreter.nativeToPseudo(atob(value));
                            });
                        case 'GetRandomNumberBetween': // https://developers.google.com/tag-manager/templates/api#generaterandom
                            return interpreter.createNativeFunction((min: number, max: number) => {
                                return interpreter.nativeToPseudo(Random.numberBetween(min, max));
                            });
                        // Missing - https://developers.google.com/tag-manager/templates/api#getcontainerversion
                        case 'GetCookie': // https://developers.google.com/tag-manager/templates/api#getcookievalues
                            return interpreter.createNativeFunction((key: string) => {
                                if (
                                    this.satisfiesPermission(
                                        PlatformActionPermissionRequest.COOKIE,
                                        {
                                            variableScope: {
                                                name: key,
                                                read: true,
                                                write: false,
                                                execute: false,
                                            },
                                        },
                                        permissions,
                                    )
                                ) {
                                    return interpreter.nativeToPseudo(getCookieItem(key));
                                } else {
                                    failure(
                                        `Unable to get cookie '${key}', missing read permission`,
                                    );
                                    return null;
                                }
                            });
                        // Missing - https://developers.google.com/tag-manager/templates/api#getqueryparameters
                        // Missing - https://developers.google.com/tag-manager/templates/api#getreferrerqueryparameters
                        case 'GetReferrerURL': // https://developers.google.com/tag-manager/templates/api#getreferrerurl
                            return interpreter.createNativeFunction(() => {
                                if (
                                    this.satisfiesPermission(
                                        PlatformActionPermissionRequest.READ_REFERRER_URL,
                                        {
                                            urlParts: [
                                                PlatformActionPermissionURLParts.PROTOCOL,
                                                PlatformActionPermissionURLParts.HOST,
                                                PlatformActionPermissionURLParts.PATH,
                                                PlatformActionPermissionURLParts.QUERY,
                                                PlatformActionPermissionURLParts.FRAGMENT,
                                            ],
                                        },
                                        permissions,
                                    )
                                ) {
                                    return interpreter.nativeToPseudo(
                                        getTopWindow().document.referrer,
                                    );
                                } else {
                                    failure(
                                        `Permission error. All URL scopes are required to view the full referrer URL`,
                                    );
                                    return undefined;
                                }
                            });
                        case 'GetTimeStamp': // https://developers.google.com/tag-manager/templates/api#gettimestamp
                            return interpreter.createNativeFunction(() => {
                                return interpreter.nativeToPseudo(
                                    Math.round(new Date().getTime() / 1000),
                                );
                            });
                        case 'GetTimeStampMillis': // https://developers.google.com/tag-manager/templates/api#gettimestampmillis
                            return interpreter.createNativeFunction(() => {
                                return interpreter.nativeToPseudo(new Date().getTime());
                            });
                        case 'GetType': // https://developers.google.com/tag-manager/templates/api#gettype
                            return interpreter.createNativeFunction((value: any) => {
                                if (Array.isArray(value)) {
                                    return interpreter.nativeToPseudo('array');
                                } else if (value === null) {
                                    return interpreter.nativeToPseudo('null');
                                } else {
                                    return interpreter.nativeToPseudo(typeof value);
                                }
                            });
                        case 'GetWindowURL': // https://developers.google.com/tag-manager/templates/api#geturl
                            return interpreter.createNativeFunction(() => {
                                if (
                                    this.satisfiesPermission(
                                        PlatformActionPermissionRequest.READ_PAGE_URL,
                                        {
                                            urlParts: [
                                                PlatformActionPermissionURLParts.PROTOCOL,
                                                PlatformActionPermissionURLParts.HOST,
                                                PlatformActionPermissionURLParts.PATH,
                                                PlatformActionPermissionURLParts.QUERY,
                                                PlatformActionPermissionURLParts.FRAGMENT,
                                            ],
                                        },
                                        permissions,
                                    )
                                ) {
                                    return interpreter.nativeToPseudo(getTopWindow().location.href);
                                } else {
                                    failure(
                                        `Permission error. All URL scopes are required to view the full window URL`,
                                    );
                                    return undefined;
                                }
                            });
                        case 'InjectHiddenFrame': // https://developers.google.com/tag-manager/templates/api#injecthiddeniframe
                            return interpreter.createNativeFunction(
                                (url: string, complete?: () => void, error?: () => void) => {
                                    const urlParts = URLParser.parse(url);
                                    const onSuccess = () => {
                                        if (complete !== undefined) {
                                            interpreter.queueFunction(complete, undefined);
                                            interpreter.run();
                                        }
                                    };
                                    const onFailure = () => {
                                        if (error !== undefined) {
                                            interpreter.queueFunction(error, undefined);
                                            interpreter.run();
                                        }
                                    };
                                    if (urlParts === undefined) {
                                        failure(`Invalid script URL provided`);
                                        onFailure();
                                    } else {
                                        if (
                                            this.satisfiesPermission(
                                                PlatformActionPermissionRequest.CREATE_IFRAME,
                                                {
                                                    hostMatch: urlParts.host,
                                                },
                                                permissions,
                                            )
                                        ) {
                                            getTopWindow().document.body.appendChild(
                                                Frame.createHiddenFrame(url, onSuccess, onFailure),
                                            );
                                        } else {
                                            failure(
                                                `Permission error. Unable to inject hidden frame from ${urlParts.host}`,
                                            );
                                            onFailure();
                                        }
                                    }
                                },
                            );
                        case 'InjectScript': // https://developers.google.com/tag-manager/templates/api#injectscript
                            return interpreter.createNativeFunction(
                                (url: string, complete?: () => void, error?: () => void) => {
                                    const urlParts = URLParser.parse(url);
                                    const onSuccess = () => {
                                        if (complete !== undefined) {
                                            interpreter.queueFunction(complete, undefined);
                                            interpreter.run();
                                        }
                                    };
                                    const onFailure = () => {
                                        if (error !== undefined) {
                                            interpreter.queueFunction(error, undefined);
                                            interpreter.run();
                                        }
                                    };
                                    if (urlParts === undefined) {
                                        failure(`Invalid script URL provided`);
                                        onFailure();
                                    } else {
                                        if (
                                            this.satisfiesPermission(
                                                PlatformActionPermissionRequest.INJECT_JAVASCRIPT,
                                                {
                                                    hostMatch: urlParts.host,
                                                },
                                                permissions,
                                            )
                                        ) {
                                            Loader.loadJS(
                                                url,
                                                getTopWindow(),
                                                onSuccess,
                                                onFailure,
                                            );
                                        } else {
                                            failure(
                                                `Permission error. Unable to load script from ${urlParts.host}`,
                                            );
                                            onFailure();
                                        }
                                    }
                                },
                            );
                        case 'JSONStringify': // https://developers.google.com/tag-manager/templates/api#json
                            return interpreter.createNativeFunction((obj: any) => {
                                return interpreter.nativeToPseudo(JSON.stringify(obj));
                            });
                        case 'JSONParse': // https://developers.google.com/tag-manager/templates/api#json
                            return interpreter.createNativeFunction((encoded: string) => {
                                return interpreter.nativeToPseudo(JSON.parse(encoded));
                            });
                        case 'GetLocalStorageItem': // https://developers.google.com/tag-manager/templates/api#localstorage
                            return interpreter.createNativeFunction((key: string) => {
                                if (
                                    this.satisfiesPermission(
                                        PlatformActionPermissionRequest.LOCAL_STORAGE,
                                        {
                                            variableScope: {
                                                name: key,
                                                read: true,
                                                write: false,
                                                execute: false,
                                            },
                                        },
                                        permissions,
                                    )
                                ) {
                                    return interpreter.nativeToPseudo(
                                        getTopWindow().localStorage.getItem(key),
                                    );
                                } else {
                                    failure(
                                        `Unable to read local storage item '${key}', missing read permission`,
                                    );
                                    return null;
                                }
                            });
                        case 'SetLocalStorageItem': // https://developers.google.com/tag-manager/templates/api#localstorage
                            return interpreter.createNativeFunction((key: string, value: any) => {
                                if (
                                    this.satisfiesPermission(
                                        PlatformActionPermissionRequest.LOCAL_STORAGE,
                                        {
                                            variableScope: {
                                                name: key,
                                                read: false,
                                                write: true,
                                                execute: false,
                                            },
                                        },
                                        permissions,
                                    )
                                ) {
                                    getTopWindow().localStorage.setItem(key, value);
                                } else {
                                    failure(
                                        `Unable to create local storage item '${key}', missing write permission`,
                                    );
                                }
                            });
                        case 'RemoveLocalStorageItem': // https://developers.google.com/tag-manager/templates/api#localstorage
                            return interpreter.createNativeFunction((name: string) => {
                                if (
                                    this.satisfiesPermission(
                                        PlatformActionPermissionRequest.LOCAL_STORAGE,
                                        {
                                            variableScope: {
                                                name: name,
                                                read: false,
                                                write: true,
                                                execute: false,
                                            },
                                        },
                                        permissions,
                                    )
                                ) {
                                    getTopWindow().localStorage.removeItem(name);
                                } else {
                                    failure(
                                        `Unable to remove local storage item '${name}', missing write permission`,
                                    );
                                }
                            });
                        case 'ConsoleLog': // https://developers.google.com/tag-manager/templates/api#logtoconsole
                            return interpreter.createNativeFunction((...objs: any) => {
                                if (
                                    this.satisfiesPermission(
                                        PlatformActionPermissionRequest.LOG_TO_CONSOLE,
                                        {},
                                        permissions,
                                    )
                                ) {
                                    Logger.interpreter(...objs);
                                } else {
                                    stdErr('Attempting to log to console without permission');
                                }
                            });
                        case 'Log':
                            return interpreter.createNativeFunction((msg: string) => {
                                stdOut(msg);
                            });
                        case 'ErrorLog':
                            return interpreter.createNativeFunction((msg: string) => {
                                stdErr(msg);
                            });
                        case 'ToInt': // https://developers.google.com/tag-manager/templates/api#makeinteger
                            return interpreter.createNativeFunction((value: any) =>
                                interpreter.nativeToPseudo(parseInt(value)),
                            );
                        case 'ToFloat': // https://developers.google.com/tag-manager/templates/api#makenumber
                            return interpreter.createNativeFunction((value: any) =>
                                interpreter.nativeToPseudo(parseFloat(value)),
                            );
                        case 'ToString': // https://developers.google.com/tag-manager/templates/api#makestring
                            return interpreter.createNativeFunction((value: any) =>
                                interpreter.nativeToPseudo(String(value).toString()),
                            );
                        // Missing - https://developers.google.com/tag-manager/templates/api#maketablemap
                        case 'MathAbs': // https://developers.google.com/tag-manager/templates/api#math
                            return interpreter.createNativeFunction((value: any) =>
                                interpreter.nativeToPseudo(Math.abs(value)),
                            );
                        case 'MathFloor': // https://developers.google.com/tag-manager/templates/api#math
                            return interpreter.createNativeFunction((value: any) =>
                                interpreter.nativeToPseudo(Math.floor(value)),
                            );
                        case 'MathCeil': // https://developers.google.com/tag-manager/templates/api#math
                            return interpreter.createNativeFunction((value: any) =>
                                interpreter.nativeToPseudo(Math.ceil(value)),
                            );
                        case 'MathRound': // https://developers.google.com/tag-manager/templates/api#math
                            return interpreter.createNativeFunction((value: any) =>
                                interpreter.nativeToPseudo(Math.round(value)),
                            );
                        case 'MathMax': // https://developers.google.com/tag-manager/templates/api#math
                            return interpreter.createNativeFunction((value1: any, value2: any) =>
                                interpreter.nativeToPseudo(Math.max(value1, value2)),
                            );
                        case 'MathMin': // https://developers.google.com/tag-manager/templates/api#math
                            return interpreter.createNativeFunction((value1: any, value2: any) =>
                                interpreter.nativeToPseudo(Math.min(value1, value2)),
                            );
                        case 'MathPow': // https://developers.google.com/tag-manager/templates/api#math
                            return interpreter.createNativeFunction((value1: any, value2: any) =>
                                interpreter.nativeToPseudo(Math.pow(value1, value2)),
                            );
                        case 'MathSqrt': // https://developers.google.com/tag-manager/templates/api#math
                            return interpreter.createNativeFunction((value: any) =>
                                interpreter.nativeToPseudo(Math.sqrt(value)),
                            );
                        case 'ParseURL': // https://developers.google.com/tag-manager/templates/api#parseurl
                            return interpreter.createNativeFunction((url: string) =>
                                interpreter.nativeToPseudo(URLParser.parse(url)),
                            );
                        case 'SetCookie': // https://developers.google.com/tag-manager/templates/api#setcookie
                            return interpreter.createNativeFunction(
                                (
                                    key: string,
                                    value: string,
                                    options?: {
                                        domain?: string;
                                        path?: string;
                                        expires?: string;
                                        secure?: string;
                                        sameSite?: string;
                                    },
                                    encode = true,
                                ) => {
                                    if (
                                        this.satisfiesPermission(
                                            PlatformActionPermissionRequest.COOKIE,
                                            {
                                                variableScope: {
                                                    name: key,
                                                    read: false,
                                                    write: true,
                                                    execute: false,
                                                },
                                            },
                                            permissions,
                                        )
                                    ) {
                                        setCookieItem(key, value, options, encode);
                                    } else {
                                        failure(
                                            `Unable to create cookie '${key}', missing write permission`,
                                        );
                                    }
                                },
                            );
                        case 'GetCharacterSet': // https://developers.google.com/tag-manager/templates/api#readcharacterset
                            return interpreter.createNativeFunction(() => {
                                if (
                                    this.satisfiesPermission(
                                        PlatformActionPermissionRequest.READ_DOCUMENT_CHARACTER_SET,
                                        {},
                                        permissions,
                                    )
                                ) {
                                    return interpreter.nativeToPseudo(
                                        getTopWindow().document.characterSet,
                                    );
                                } else {
                                    failure(`Permission error. Unable to read character set`);
                                    return undefined;
                                }
                            });
                        case 'GetPageTitle': // https://developers.google.com/tag-manager/templates/api#readtitle
                            return interpreter.createNativeFunction(() => {
                                if (
                                    this.satisfiesPermission(
                                        PlatformActionPermissionRequest.READ_PAGE_TITLE,
                                        {},
                                        permissions,
                                    )
                                ) {
                                    return interpreter.nativeToPseudo(
                                        getTopWindow().document.title,
                                    );
                                } else {
                                    failure(`Permission error. Unable to read page title`);
                                    return undefined;
                                }
                            });
                        case 'SendPixel': // https://developers.google.com/tag-manager/templates/api#sendpixel
                            return interpreter.createNativeFunction(
                                (url: string, complete?: () => void, error?: () => void): void => {
                                    const urlParts = URLParser.parse(url);
                                    const onSuccess = () => {
                                        if (complete !== undefined) {
                                            interpreter.queueFunction(complete, undefined);
                                            interpreter.run();
                                        }
                                    };
                                    const onFailure = () => {
                                        if (error !== undefined) {
                                            interpreter.queueFunction(error, undefined);
                                            interpreter.run();
                                        }
                                    };
                                    if (urlParts === undefined) {
                                        failure(`Invalid image URL provided`);
                                        onFailure();
                                    } else {
                                        if (
                                            this.satisfiesPermission(
                                                PlatformActionPermissionRequest.IMAGE_PIXEL,
                                                {
                                                    hostMatch: urlParts.host,
                                                },
                                                permissions,
                                            )
                                        ) {
                                            getTopWindow().document.body.appendChild(
                                                Pixel.create(url, onSuccess, onFailure),
                                            );
                                        } else {
                                            failure(
                                                `Permission error. Unable to load image from ${urlParts.host}`,
                                            );
                                            onFailure();
                                        }
                                    }
                                },
                            );
                        case 'WindowVariableSet': // https://developers.google.com/tag-manager/templates/api#setinwindow
                            return interpreter.createNativeFunction((path: string, value: any) => {
                                if (
                                    this.satisfiesPermission(
                                        PlatformActionPermissionRequest.GLOBAL_VARIABLE,
                                        {
                                            variableScope: {
                                                name: path,
                                                read: false,
                                                write: true,
                                                execute: false,
                                            },
                                        },
                                        permissions,
                                    )
                                ) {
                                    const topWindow = getTopWindow();
                                    ObjectReference.setValueFromPath(path, topWindow, value, true);
                                } else {
                                    failure(
                                        `Unable to write to variable at ${path}, missing write permission`,
                                    );
                                }
                            });
                        /*
                            Todo ...
                            Not MVP - https://developers.google.com/tag-manager/templates/api#querypermission
                            Not MVP - https://developers.google.com/tag-manager/templates/api#sha256
                            Not MVP (not many use cases) - https://developers.google.com/tag-manager/templates/api#templatestorage
                         */
                        default:
                            throw new Error(`No package found for '${packageName}'...`);
                    }
                }),
            );
            interpreter.setProperty(
                globalObject,
                'success',
                interpreter.createNativeFunction(() => {
                    stdOut('Success Called');
                    success();
                }),
            );
            interpreter.setProperty(
                globalObject,
                'failure',
                interpreter.createNativeFunction((reason: string) => failure(reason)),
            );
            interpreter.setProperty(globalObject, 'data', interpreter.nativeToPseudo(actionData));
        });
    }
}
