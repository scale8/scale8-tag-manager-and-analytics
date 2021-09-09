import { TagCode } from '../../../../../common/types/Types';

export type S8ConfigModel = { [k: string]: any };

export type S8Config = {
    envId: string;
    envVars: { [k: string]: string };
    appId: string;
    revisionId: string;
    corePlatformId: string;
    countryCode: string;
    subdivisionCodes: string[];
    models: { [k: string]: S8ConfigModel };
    ingestEndpointEnvironments: { [k: string]: string };
    server: string;
    serverMode: string;
    distributionValue: number;
    uiServer: string;
    preview?: string;
};

//we can expand on this query language later if we need to...
export type Query = { [k: string]: any };

export type EventStatus = {
    eventId: string;
    passing: boolean;
};

export type ConditionRuleStatus = {
    conditionRuleId: string;
    info: string;
    passing: boolean;
};

export type ActionStatus = {
    actionId: string;
    executed: boolean;
};

export type ActionGroupStatus = {
    actionGroupId: string;
    actions: ActionStatus[];
    executed: boolean;
};

export type ActionGroupDistributionStatus = {
    actionGroupDistributionId: string;
    actionGroups: ActionGroupStatus[];
    executed: boolean;
};

export type RuleStatus = {
    ruleId: string;
    applied: boolean;
    ts: number;
    index: number;
    events?: EventStatus[];
    conditionRules?: ConditionRuleStatus[];
    exceptionRules?: ConditionRuleStatus[];
    actionGroupDistributions?: ActionGroupDistributionStatus[];
};

export type RuleGroupStatus = {
    ruleGroupId: string;
    applied: boolean;
    rules: RuleStatus[];
};

export type TagStatus = {
    tagCode: TagCode;
    ruleGroups: RuleGroupStatus[];
};

export type GlobalVarStatus = {
    dataContainerId: string;
    dataContainerPersistenceId: string;
    values: Record<string, unknown>;
};

export type RuleVarStatus = {
    dataContainerId: string;
    dataContainerPersistenceId: string;
    ruleId: string;
    values: Record<string, unknown>;
};

export type LogEntry = {
    tagCode: TagCode;
    ruleId: string;
    ruleIndex: number;
    entityId: string;
    entityType: 'event' | 'condition' | 'action';
    msg: string;
    isError: boolean;
};

export type RevisionStatus = {
    revisionId: string;
    platformId: string;
    appId: string;
    countryCode: string;
    subdivisionCodes: string[];
    server: string;
    tags: TagStatus[];
    globalVars: GlobalVarStatus[];
    ruleVars: RuleVarStatus[];
    log: LogEntry[];
    refreshTarget: boolean;
};
