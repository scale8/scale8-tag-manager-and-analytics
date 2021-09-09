export type TagCode = {
    code: string;
    index: number;
};

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
    hasErrors?: boolean; // ui only
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
    entityType: PreviewElementType;
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

export type FrameEvent = {
    isS8FrameEvent: boolean;
    event: string;
    payload: any;
};

export type PreviewElementType = 'event' | 'condition' | 'action';

export type PreviewElementDetails = {
    type: PreviewElementType;
    tagCode: TagCode;
    id: string;
};
