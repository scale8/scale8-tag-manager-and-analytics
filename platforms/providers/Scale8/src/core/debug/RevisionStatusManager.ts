import {
    GlobalVarStatus,
    LogEntry,
    RevisionStatus,
    RuleVarStatus,
    TagStatus,
} from '../types/Types';
import Context from '../lib/Context';
import UserDebugMode from '../lib/UserDebugMode';
import { Action, ConditionRule, Event } from '../config/ModelTypes';
import { TagCode } from '../../../../../common/types/Types';
import { messageFromFrameEvent } from '../funcs/MessageFromFrameEvent';

export default class RevisionStatusManager {
    private static readonly tagsMap = new Map<string, TagStatus>();
    private static readonly globalVarsMap = new Map<string, GlobalVarStatus>();
    private static readonly ruleVarsMap = new Map<string, RuleVarStatus>();
    private static readonly log: LogEntry[] = [];
    private static _messageTarget: WindowProxy | null = null;

    public static setMessageTarget(iframe: HTMLIFrameElement): void {
        this._messageTarget = iframe.contentWindow;
    }

    static getMessageTarget(): WindowProxy | null {
        return this._messageTarget;
    }

    private static buildRevisionStatus(refreshTarget = false): RevisionStatus {
        return {
            server: Context.getServer(),
            revisionId: Context.getRevisionId(),
            appId: Context.getAppId(),
            platformId: Context.getPlatformId(),
            countryCode: Context.getCountryCode(),
            subdivisionCodes: Context.getSubdivisionCodes(),
            tags: Array.from(this.tagsMap.values()),
            globalVars: Array.from(this.globalVarsMap.values()),
            ruleVars: Array.from(this.ruleVarsMap.values()),
            log: this.log,
            refreshTarget,
        };
    }

    public static sendRevisionStatus(refreshTarget = false): void {
        if (this._messageTarget !== null) {
            this._messageTarget.postMessage(
                messageFromFrameEvent('statusUpdate', this.buildRevisionStatus(refreshTarget)),
                '*',
            );
        }
    }

    public static updateVarStatus(
        dataContainerId: string,
        dataContainerPersistenceId: string,
        data: Record<string, unknown> | [string, Record<string, unknown>][],
    ): void {
        if (Array.isArray(data)) {
            this.updateRuleVarsStatus(dataContainerId, dataContainerPersistenceId, data);
        } else {
            this.updateGlobalVarStatus(dataContainerId, dataContainerPersistenceId, data);
        }
    }

    public static updateGlobalVarStatus(
        dataContainerId: string,
        dataContainerPersistenceId: string,
        values: Record<string, unknown>,
    ): void {
        if (UserDebugMode.isEnabled()) {
            this.globalVarsMap.set(`${dataContainerId}`, {
                dataContainerId,
                dataContainerPersistenceId,
                values,
            });
            this.sendRevisionStatus();
        }
    }

    public static updateRuleVarsStatus(
        dataContainerId: string,
        dataContainerPersistenceId: string,
        rules: [string, Record<string, unknown>][],
    ): void {
        if (UserDebugMode.isEnabled()) {
            rules.forEach(([ruleId, values]) => {
                this.ruleVarsMap.set(`${ruleId}${dataContainerId}`, {
                    dataContainerId,
                    dataContainerPersistenceId,
                    ruleId,
                    values,
                });
            });
            this.sendRevisionStatus();
        }
    }

    public static updateTagStatus(status: TagStatus): void {
        if (UserDebugMode.isEnabled()) {
            this.tagsMap.set(`${status.tagCode.code}${status.tagCode.index}`, status);
            this.sendRevisionStatus();
        }
    }

    public static updateEntityLog(
        tagCode: TagCode,
        ruleId: string,
        ruleIndex: number,
        entity: Event | ConditionRule | Action,
        msg: string,
        isError: boolean,
    ): void {
        const getEntityType = () => {
            if (entity.___type === 'Action') {
                return 'action';
            } else if (entity.___type === 'ConditionRule') {
                return 'condition';
            } else if (entity.___type === 'Event') {
                return 'event';
            } else {
                throw new Error(`Entity type ${entity.___type} is not supported`);
            }
        };
        if (UserDebugMode.isEnabled()) {
            this.log.push({
                tagCode: tagCode,
                ruleId: ruleId,
                ruleIndex: ruleIndex,
                entityId: entity._id.id,
                entityType: getEntityType(),
                msg: msg,
                isError: isError,
            });
            this.sendRevisionStatus();
        }
    }
}
