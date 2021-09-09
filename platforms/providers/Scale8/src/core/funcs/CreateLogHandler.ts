import { Action, ConditionRule, Event, Rule } from '../config/ModelTypes';
import RevisionStatusManager from '../debug/RevisionStatusManager';
import Logger from '../../../../../common/lib/util/Logger';
import { TagCode } from '../../../../../common/types/Types';

export const createLogHandler = (
    type: 'ERR' | 'LOG',
    tagCode: TagCode,
    rule: Rule,
    ruleIndex: number,
    entity: Event | ConditionRule | Action,
) => {
    return (msg: string) => {
        RevisionStatusManager.updateEntityLog(
            tagCode,
            rule._id.id,
            ruleIndex,
            entity,
            msg,
            type === 'ERR',
        );
        Logger.debug(`${entity._id.id}: ${msg}`);
    };
};
