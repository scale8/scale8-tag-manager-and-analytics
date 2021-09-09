import { LogEntry, PreviewElementType, TagCode, TagStatus } from '../types/PreviewFrameTypes';

const matchTagCode = (a: TagCode | undefined, b: TagCode | undefined): boolean => {
    if (a === undefined) {
        return b === undefined;
    }
    if (b === undefined) {
        return false;
    }
    return a.code === b.code && a.index === b.index;
};

const findTagIndex = (loadedTags: TagStatus[], currentTagIndex: number | undefined): number => {
    const foundIndex = loadedTags?.findIndex(
        (_) => _.tagCode.index === (currentTagIndex === undefined ? -1 : currentTagIndex),
    );
    return foundIndex === undefined || foundIndex === -1 ? 0 : foundIndex;
};

const extractCurrentElementLog = (
    type: PreviewElementType,
    tagCode: TagCode | undefined,
    ruleId: string,
    ruleIndex: number,
    entityId: string,
    log: LogEntry[],
): LogEntry[] => {
    return log.filter(
        (_) =>
            _.ruleId === ruleId &&
            _.ruleIndex === ruleIndex &&
            _.entityId === entityId &&
            matchTagCode(_.tagCode, tagCode) &&
            _.entityType === type,
    );
};

const extractRuleLog = (
    tagCode: TagCode | undefined,
    ruleId: string,
    ruleIndex: number,
    log: LogEntry[],
): LogEntry[] => {
    return log.filter(
        (_) => _.ruleId === ruleId && _.ruleIndex === ruleIndex && matchTagCode(_.tagCode, tagCode),
    );
};

const ruleHasError = (
    tagCode: TagCode | undefined,
    ruleId: string,
    ruleIndex: number,
    log: LogEntry[],
): boolean => {
    return extractRuleLog(tagCode, ruleId, ruleIndex, log).filter((_) => _.isError).length > 0;
};

export { extractCurrentElementLog, matchTagCode, findTagIndex, ruleHasError };
