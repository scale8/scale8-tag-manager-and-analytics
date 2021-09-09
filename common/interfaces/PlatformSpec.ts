import {
    PlatformActionData,
    PlatformDataContainerChangeData,
    PlatformDataContainerDumpData,
    PlatformDataContainerGetData,
    PlatformEventCreateData,
    PlatformEventTestData,
} from '../../platforms/common/types/Types';
import { InputType } from '../enums/InputType';
import { TypeIcon } from '../enums/TypeIcon';
import { DataMapValue } from '../types/Types';
import { ValidationType } from '../enums/ValidationType';

export interface PlatformEventSpec {
    persistence_id: string;
    name: string;
    description?: string;
    icon?: TypeIcon;
    data?: PlatformInputSpec[];
}

export interface PlatformEventFunctions {
    create: (
        data: PlatformEventCreateData,
        log: (msg: string) => void,
        err: (msg: string) => void,
    ) => void;
    reset?: (
        data: PlatformEventCreateData,
        log: (msg: string) => void,
        err: (msg: string) => void,
    ) => void;
    test: (
        data: PlatformEventTestData,
        log: (msg: string) => void,
        err: (msg: string) => void,
    ) => boolean;
}

export interface PlatformDataContainerSpec {
    persistence_id: string;
    name: string;
    allow_custom: boolean;
    description?: string;
    icon?: TypeIcon;
    data?: PlatformInputSpec[];
}

export interface PlatformDataContainerFunctions {
    change?: (
        data: PlatformDataContainerChangeData,
        log: (msg: string) => void,
        err: (msg: string) => void,
    ) => void; //optional as a data container could be immutable
    get: (
        data: PlatformDataContainerGetData,
        log: (msg: string) => void,
        err: (msg: string) => void,
    ) => any;
    dump: (
        data: PlatformDataContainerDumpData,
    ) => { [k: string]: any } | [string, { [k: string]: any }][];
}

export interface PlatformActionSpec {
    persistence_id: string;
    name: string;
    description?: string;
    icon?: TypeIcon;
    data?: PlatformInputSpec[];
}

export interface PlatformActionFunctions {
    run: (
        data: PlatformActionData,
        log: (msg: string) => void,
        err: (msg: string) => void,
    ) => Promise<any> | void;
}

export interface PlatformInputSpec {
    key: string;
    input_type: InputType;
    description?: string;
    default_value?: DataMapValue;
    option_values?: DataMapValue[];
    child_platform_data_maps?: PlatformInputSpec[];
    optional?: boolean;
    validation_rules?: {
        type: ValidationType;
        input_value: DataMapValue;
    }[];
}

export interface PlatformSpec {
    name: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    actions?: (PlatformActionSpec & PlatformActionFunctions)[];
    events?: (PlatformEventSpec & PlatformEventFunctions)[];
    data_containers?: (PlatformDataContainerSpec & PlatformDataContainerFunctions)[];
}

export interface PlatformConfigOnly {
    name: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    actions?: PlatformActionSpec[];
    events?: PlatformEventSpec[];
    data_containers?: PlatformDataContainerSpec[];
}
