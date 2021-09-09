import { TagType } from '../enums/Enums';

export type PlatformActionData = {
    ruleId: string;
    tagCode: TagCode;
    macroReplace: (s: string) => any;
    props: { [k: string]: any };
    tagProps: {
        width: number;
        height: number;
        type: TagType;
        name: string;
    };
};

export type PlatformDataContainerGetData = {
    key: string;
    ruleId: string;
    tagCode: TagCode;
};

export type PlatformDataContainerDumpData = {
    ruleId?: string;
    tagCode?: TagCode;
};

export type PlatformDataContainerChangeData = {
    ruleId: string;
    tagCode: TagCode;
    trigger: () => void;
};

export type PlatformEventCreateData = {
    ruleId: string;
    tagCode: TagCode;
    trigger: () => void;
    props: { [k: string]: any };
    state: { [k: string]: any };
    tagProps: {
        width: number;
        height: number;
        type: TagType;
        name: string;
    };
};

export type PlatformEventTestData = {
    ruleId: string;
    tagCode: TagCode;
    props: { [k: string]: any };
    state: { [k: string]: any };
    tagProps: {
        width: number;
        height: number;
        type: TagType;
        name: string;
    };
};

export type TagCode = {
    code: string;
    index: number;
};
