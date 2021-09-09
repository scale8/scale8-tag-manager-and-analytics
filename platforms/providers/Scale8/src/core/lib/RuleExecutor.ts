import Random from '../../../../../common/lib/util/Random';
import TagStore from './TagStore';
import EventStore from './EventStore';
import {
    ActionGroupDistributionStatus,
    ActionGroupStatus,
    ActionStatus,
    ConditionRuleStatus,
    EventStatus,
    RuleGroupStatus,
    RuleStatus,
    TagStatus,
} from '../types/Types';
import Logger from '../../../../../common/lib/util/Logger';
import Match from '../../../../../common/lib/util/Match';
import Context from './Context';
import Collection from '../config/Collection';
import {
    Rule,
    Trigger,
    Event,
    PlatformEvent,
    DataMap,
    Tag,
    ConditionRule,
    PlatformDataContainer,
    Action,
    PlatformAction,
    Platform,
    ActionGroup,
    ActionGroupDistribution,
    RuleGroup,
} from '../config/ModelTypes';
import { dataMapToObject } from '../funcs/DataMapToObject';
import { generateDotNotation } from '../funcs/GenerateDotNotation';
import PlatformEventRegister from './PlatformEventRegister';
import PlatformDataContainerRegister from './PlatformDataContainerRegister';
import PlatformActionRegister from './PlatformActionRegister';
//todo. address this. force this to load...
import 'core-js/es/string/replace-all';
import { handleExceptionWithLogger } from '../funcs/HandleExceptionWithLogger';
import { createLogHandler } from '../funcs/CreateLogHandler';
import { PlatformActionData, TagCode } from '../../../../../common/types/Types';
import { getTopWindow } from '../../../../../common/lib/util/WindowElement';
import { ActionGroupDistributionType, PlatformType } from '../../../../../common/enums/Enums';
import { RefId } from '../../../../../common/models/RefId';
import Future from '../../../../../common/lib/util/Future';

export default class RuleExecutor {
    private static getTriggerFromRule(rule: Rule): Trigger {
        return typeof rule._global_trigger_id === 'string'
            ? Collection.findOneThrows<Trigger>('Trigger', {
                  ___persisting_id: rule._global_trigger_id,
              })
            : Collection.findByIdThrows<Trigger>('Trigger', rule._custom_trigger_id);
    }

    private static resetEvents(tagCode: TagCode, rule: Rule, ruleIndex: number): void {
        Collection.findByIds<Event>('Event', this.getTriggerFromRule(rule)._event_ids).forEach(
            (event) => {
                EventStore.clearEventState(event._id.id, tagCode);
                if (typeof event._event !== 'string') {
                    const platformEvent = Collection.findByIdThrows<PlatformEvent>(
                        'PlatformEvent',
                        event._event,
                    );
                    const eventFunctions = PlatformEventRegister.getEventFunctions(
                        platformEvent._platform_id.id,
                        platformEvent.___persisting_id,
                    );
                    if (eventFunctions.reset !== undefined) {
                        const dataMaps = Collection.findByIds<DataMap>(
                            'DataMap',
                            event._data_map_ids,
                        );
                        const config = dataMapToObject(dataMaps);
                        const tag = Collection.findOneThrows<Tag>('Tag', {
                            _tag_code: tagCode.code,
                        });

                        const logHandler = createLogHandler('LOG', tagCode, rule, ruleIndex, event);
                        const errHandler = createLogHandler('ERR', tagCode, rule, ruleIndex, event);

                        try {
                            logHandler('Reset event called');
                            eventFunctions.reset(
                                {
                                    ruleId: rule._id.id,
                                    trigger: () =>
                                        getTopWindow().dispatchEvent(
                                            EventStore.getCustomBrowserEvent(event._id.id, tagCode)
                                                .customEvent,
                                        ),
                                    props: config,
                                    state: EventStore.getEventState(event._id.id, tagCode),
                                    tagCode: tagCode,
                                    tagProps: {
                                        width: tag._width,
                                        height: tag._height,
                                        type: tag._type,
                                        name: tag._id.id,
                                    },
                                },
                                logHandler,
                                errHandler,
                            );
                            return {
                                eventId: event._id.id,
                                passing: false,
                            };
                        } catch (e) {
                            handleExceptionWithLogger(e, errHandler);
                            return {
                                eventId: event._id.id,
                                passing: false,
                            };
                        }
                    }
                }
            },
        );
    }

    private static testEvents(tagCode: TagCode, rule: Rule, ruleIndex: number): EventStatus[] {
        return Collection.findByIds<Event>('Event', this.getTriggerFromRule(rule)._event_ids).map(
            (event) => {
                const eventState = EventStore.getEventState(event._id.id, tagCode);
                if (typeof event._event === 'string') {
                    return {
                        eventId: event._id.id,
                        passing: eventState.triggered === true,
                    };
                } else {
                    const platformEvent = Collection.findByIdThrows<PlatformEvent>(
                        'PlatformEvent',
                        event._event,
                    );
                    const eventFunctions = PlatformEventRegister.getEventFunctions(
                        platformEvent._platform_id.id,
                        platformEvent.___persisting_id,
                    );
                    const dataMaps = Collection.findByIds<DataMap>('DataMap', event._data_map_ids);
                    const config = dataMapToObject(dataMaps);
                    const tag = Collection.findOneThrows<Tag>('Tag', {
                        _tag_code: tagCode.code,
                    });

                    const logHandler = createLogHandler('LOG', tagCode, rule, ruleIndex, event);
                    const errHandler = createLogHandler('ERR', tagCode, rule, ruleIndex, event);

                    try {
                        logHandler('Testing event status');
                        const passing = eventFunctions.test(
                            {
                                ruleId: rule._id.id,
                                props: config,
                                state: eventState,
                                tagCode: tagCode,
                                tagProps: {
                                    width: tag._width,
                                    height: tag._height,
                                    type: tag._type,
                                    name: tag._id.id,
                                },
                            },
                            logHandler,
                            errHandler,
                        );
                        return {
                            eventId: event._id.id,
                            passing: passing,
                        };
                    } catch (e) {
                        handleExceptionWithLogger(e, errHandler);
                        return {
                            eventId: event._id.id,
                            passing: false,
                        };
                    }
                }
            },
        );
    }

    private static testConditionRules(
        tagCode: TagCode,
        rule: Rule,
        ruleIndex: number,
        type: 'CONDITION' | 'EXCEPTION',
    ): ConditionRuleStatus[] {
        const trigger = this.getTriggerFromRule(rule);
        return Collection.findByIds<ConditionRule>(
            'ConditionRule',
            type === 'CONDITION' ? trigger._condition_rule_ids : trigger._exception_rule_ids,
        ).map((conditionRule) => {
            const getKey = () => {
                if (typeof conditionRule._match === 'string') {
                    //this is a custom match...
                    return conditionRule._match;
                } else {
                    //generate dot notation key...
                    const k = generateDotNotation(
                        conditionRule._platform_data_container_id,
                        conditionRule._match,
                    );
                    return typeof conditionRule._match_key === 'string'
                        ? `${k}.${conditionRule._match_key}`
                        : k;
                }
            };
            const platformDataContainer = Collection.findByIdThrows<PlatformDataContainer>(
                'PlatformDataContainer',
                conditionRule._platform_data_container_id,
            );
            const dataContainerFunctions = PlatformDataContainerRegister.getDataContainerFunctions(
                platformDataContainer._platform_id.id,
                platformDataContainer.___persisting_id,
            );

            const logHandler = createLogHandler('LOG', tagCode, rule, ruleIndex, conditionRule);
            const errHandler = createLogHandler('ERR', tagCode, rule, ruleIndex, conditionRule);

            const key = getKey();

            try {
                logHandler(`Testing condition status for ${key}`);
                const value = dataContainerFunctions.get(
                    {
                        key: key,
                        ruleId: rule._id.id,
                        tagCode: tagCode,
                    },
                    logHandler,
                    errHandler,
                );
                const matchCheck = Match.check(
                    value,
                    conditionRule._match_value,
                    conditionRule._match_condition,
                );
                logHandler(matchCheck.info);
                return {
                    conditionRuleId: conditionRule._id.id,
                    info: matchCheck.info,
                    passing: type === 'CONDITION' ? matchCheck.passing : !matchCheck.passing,
                };
            } catch (e) {
                handleExceptionWithLogger(e, errHandler);
                return {
                    conditionRuleId: conditionRule._id.id,
                    info: 'Failed to fetch value, please see error log',
                    passing: false,
                };
            }
        });
    }

    private static macroReplace(
        s: string,
        rule: Rule,
        tagCode: TagCode,
        logHandler: (msg: string) => void,
        errHandler: (msg: string) => void,
    ): any {
        const parts = s.match(/^{{([^.]+)\.([^}]+)}}$/);
        if (parts === null) {
            return s;
        } else {
            const dataLayerPersistId = parts[1];
            const keyRef = parts[2];
            const platformDataContainer = Collection.findOneThrows<PlatformDataContainer>(
                'PlatformDataContainer',
                {
                    ___persisting_id: dataLayerPersistId,
                },
            );
            return PlatformDataContainerRegister.getDataContainerFunctions(
                platformDataContainer._platform_id.id,
                platformDataContainer.___persisting_id,
            ).get(
                {
                    key: keyRef,
                    ruleId: rule._id.id,
                    tagCode: tagCode,
                },
                logHandler,
                errHandler,
            );
        }
    }

    private static createActionPromiseWrapper(
        action: Action,
        platformAction: PlatformAction,
        tagCode: TagCode,
        rule: Rule,
        ruleIndex: number,
        f: (
            data: PlatformActionData,
            log: (msg: string) => void,
            err: (msg: string) => void,
        ) => Promise<void> | void,
    ): () => Promise<void> {
        const dataMaps = Collection.findByIds<DataMap>('DataMap', action._data_map_ids);
        const tag = Collection.findOneThrows<Tag>('Tag', {
            _tag_code: tagCode.code,
        });
        const logHandler = createLogHandler('LOG', tagCode, rule, ruleIndex, action);
        const errHandler = createLogHandler('ERR', tagCode, rule, ruleIndex, action);
        const platformType: PlatformType = Collection.findByIdThrows<Platform>(
            'Platform',
            platformAction._platform_id,
        )._type;

        return () =>
            new Promise<void>((_resolve, _reject) => {
                let timeout: any = undefined;
                const resolve = () => {
                    if (timeout !== undefined) {
                        clearTimeout(timeout);
                    }
                    _resolve();
                };
                const reject = (reason: any) => {
                    if (timeout !== undefined) {
                        clearTimeout(timeout);
                    }
                    _reject(reason);
                };
                const createTimeout = (): any => {
                    if (platformType === PlatformType.TEMPLATED) {
                        return setTimeout(() => {
                            const rtMessage =
                                'Task has taken too long to execute. success() was not called';
                            errHandler(rtMessage);
                            reject(rtMessage);
                        }, 10000);
                    } else {
                        return undefined;
                    }
                };
                timeout = createTimeout();

                const makeReplacements = (s: string) => {
                    return s.replaceAll(/{{[^}]+}}/g, (_) =>
                        this.macroReplace(_, rule, tagCode, logHandler, errHandler),
                    );
                };

                //need to try catch this...
                try {
                    logHandler('Calling method...');
                    const actionRunner = f(
                        {
                            ruleId: rule._id.id,
                            macroReplace: makeReplacements,
                            props: dataMapToObject(dataMaps),
                            tagCode: tagCode,
                            tagProps: {
                                width: tag._width,
                                height: tag._height,
                                type: tag._type,
                                name: tag._id.id,
                            },
                        },
                        logHandler,
                        errHandler,
                    );
                    if (actionRunner instanceof Promise) {
                        //re-wrap
                        actionRunner.then(
                            () => {
                                logHandler('Completed (Resolved)');
                                resolve();
                            },
                            (reason) => {
                                if (typeof reason === 'string') {
                                    errHandler(reason);
                                    reject(reason);
                                } else {
                                    const err = 'Failed, no reason given';
                                    errHandler(err);
                                    reject(err);
                                }
                            },
                        );
                    } else {
                        resolve(); //was run in sync anyhow...
                    }
                } catch (e) {
                    if (e instanceof Error) {
                        errHandler(e.message);
                        reject(e.message);
                    } else if (typeof e === 'string') {
                        errHandler(e);
                        reject(e);
                    } else {
                        const err = 'Something has gone wrong';
                        errHandler(err);
                        reject(err);
                    }
                }
            });
    }

    private static executeActionGroup(
        actionGroup: ActionGroup,
        tagCode: TagCode,
        rule: Rule,
        ruleIndex: number,
    ): ActionGroupStatus {
        const actions = Collection.findByIds<Action>('Action', actionGroup._action_ids);
        const actionPromiseWrappers: (() => Promise<void>)[] = actions.map((action) => {
            const platformAction = Collection.findByIdThrows<PlatformAction>(
                'PlatformAction',
                action._platform_action_id,
            );
            const actionFunction = PlatformActionRegister.getAction(
                platformAction._platform_id.id,
                platformAction.___persisting_id,
            );
            return this.createActionPromiseWrapper(
                action,
                platformAction,
                tagCode,
                rule,
                ruleIndex,
                actionFunction,
            );
        });
        if (actionPromiseWrappers.length > 0) {
            Future.runInSerial(actionPromiseWrappers)
                .then(() => {
                    Logger.debug(`All actions completed for action group: ${actionGroup._id.id}`);
                })
                .catch(() => {
                    Logger.debug(`Error executing actions for action group: ${actionGroup._id.id}`);
                });
        }
        return {
            actionGroupId: actionGroup._id.id,
            actions: actions.map((_) => {
                return {
                    actionId: _._id.id,
                    executed: false,
                };
            }),
            executed: true,
        };
    }

    private static selectActionGroupAtRandom(actionGroups: ActionGroup[]): ActionGroup | undefined {
        if (actionGroups.length === 0) {
            return undefined;
        } else if (actionGroups.length === 1) {
            return actionGroups[0];
        } else {
            const actionGroupMap: Map<string, { start: number; end: number }> = new Map();
            let nextIndex = 0;
            actionGroups.forEach((_) => {
                actionGroupMap.set(_._id.id, {
                    start: nextIndex + 1,
                    end: nextIndex + _._distribution,
                });
                nextIndex += _._distribution;
            });
            const randomIndex = Random.numberBetween(1, nextIndex);
            const selectedActionGroupId = Array.from(actionGroupMap).find(
                (_) => randomIndex >= _[1].start && randomIndex <= _[1].end,
            )![0];
            return actionGroups.find((_) => _._id.id === selectedActionGroupId);
        }
    }

    private static selectActionGroupForSession(
        actionGroups: ActionGroup[],
    ): ActionGroup | undefined {
        if (actionGroups.length === 0) {
            return undefined;
        } else if (actionGroups.length === 1) {
            return actionGroups[0];
        } else {
            const actionGroupMap: Map<string, { start: number; end: number }> = new Map();
            let nextIndex = -1;
            actionGroups.forEach((_) => {
                actionGroupMap.set(_._id.id, {
                    start: nextIndex + 1,
                    end: nextIndex + _._distribution,
                });
                nextIndex += _._distribution;
            });
            const selectedActionGroupId = Array.from(actionGroupMap).find(
                (_) => Context.getDistV() >= _[1].start && Context.getDistV() <= _[1].end,
            );
            if (selectedActionGroupId === undefined) {
                throw new Error(
                    `Failed to location action group against session distribution (${Context.getDistV()})`,
                );
            } else {
                return actionGroups.find((_) => _._id.id === selectedActionGroupId[0]);
            }
        }
    }

    private static executeActionGroupDistributions(
        tagCode: TagCode,
        rule: Rule,
        ruleIndex: number,
    ): ActionGroupDistributionStatus[] {
        const actionGroupDistributionIds = (): (RefId | string)[] => {
            //return preserving insertion order...
            const global = rule._global_action_group_distribution_ids;
            const custom = rule._custom_action_group_distribution_ids;
            let nextGlobalPointer = 0;
            let nextCustomPointer = 0;
            const getNextGlobalId = () => {
                const id = global[nextGlobalPointer];
                nextGlobalPointer++;
                return id;
            };
            const getNextCustomId = () => {
                const id = custom[nextCustomPointer];
                nextCustomPointer++;
                return id;
            };
            return rule._action_group_order.map((_) =>
                _ === 'G' ? getNextGlobalId() : getNextCustomId(),
            );
        };

        const actionGroupDistributions = actionGroupDistributionIds().map((id) =>
            typeof id === 'string'
                ? Collection.findOneThrows<ActionGroupDistribution>('ActionGroupDistribution', {
                      ___persisting_id: id,
                  })
                : Collection.findByIdThrows<ActionGroupDistribution>('ActionGroupDistribution', id),
        );

        return actionGroupDistributions.map(
            (actionGroupDistribution): ActionGroupDistributionStatus => {
                const actionGroups = Collection.findByIds<ActionGroup>(
                    'ActionGroup',
                    actionGroupDistribution._action_group_ids,
                );
                if (
                    actionGroupDistribution._action_group_distribution_type ===
                        ActionGroupDistributionType.PAGE_LOAD ||
                    actionGroupDistribution._action_group_distribution_type ===
                        ActionGroupDistributionType.SESSION
                ) {
                    //all the action groups contained here, only one can be chosen and is based on the distribution value
                    const selectedActionGroup =
                        actionGroupDistribution._action_group_distribution_type ===
                        ActionGroupDistributionType.PAGE_LOAD
                            ? this.selectActionGroupAtRandom(actionGroups)
                            : this.selectActionGroupForSession(actionGroups);
                    if (selectedActionGroup !== undefined) {
                        return {
                            actionGroupDistributionId: actionGroupDistribution._id.id,
                            actionGroups: [
                                this.executeActionGroup(
                                    selectedActionGroup,
                                    tagCode,
                                    rule,
                                    ruleIndex,
                                ),
                                ...actionGroups
                                    .filter((_) => _._id.id !== selectedActionGroup._id.id)
                                    .map((_): ActionGroupStatus => {
                                        return {
                                            actionGroupId: _._id.id,
                                            actions: Collection.findByIds<Action>(
                                                'Action',
                                                _._action_ids,
                                            ).map((action): ActionStatus => {
                                                return {
                                                    actionId: action._id.id,
                                                    executed: false,
                                                };
                                            }),
                                            executed: false,
                                        };
                                    }),
                            ],
                            executed: true,
                        };
                    }
                } else {
                    return {
                        actionGroupDistributionId: actionGroupDistribution._id.id,
                        actionGroups: actionGroups.map(
                            (_): ActionGroupStatus =>
                                this.executeActionGroup(_, tagCode, rule, ruleIndex),
                        ),
                        executed: true,
                    };
                }
                return {
                    actionGroupDistributionId: actionGroupDistribution._id.id,
                    actionGroups: [],
                    executed: false,
                };
            },
        );
    }

    public static checkTagRules(tagCode: TagCode, ruleId?: string): TagStatus {
        const tag = Collection.findOneThrows<Tag>('Tag', {
            _tag_code: tagCode.code,
        });

        const execRule = (rule: Rule, ruleIndex: number) =>
            this.executeActionGroupDistributions(tagCode, rule, ruleIndex);

        const testRule = (rule: Rule, ruleIndex: number) => {
            const eventsStatuses = this.testEvents(tagCode, rule, ruleIndex);
            const conditionRulesStatuses = this.testConditionRules(
                tagCode,
                rule,
                ruleIndex,
                'CONDITION',
            );
            const exceptionRulesStatuses = this.testConditionRules(
                tagCode,
                rule,
                ruleIndex,
                'EXCEPTION',
            );
            const eventsPass = eventsStatuses.every((_) => _.passing);
            const conditionRulesPass = conditionRulesStatuses.every((_) => _.passing);
            const exceptionRulesPass = exceptionRulesStatuses.every((_) => _.passing);
            return {
                ruleId: rule._id.id,
                events: eventsStatuses,
                conditionRules: conditionRulesStatuses,
                exceptionRules: exceptionRulesStatuses,
                passed: eventsPass && conditionRulesPass && exceptionRulesPass,
            };
        };

        const ruleGroupStatuses: RuleGroupStatus[] = Collection.findByIds<RuleGroup>(
            'RuleGroup',
            tag._rule_group_ids,
        ).map((ruleGroup): RuleGroupStatus => {
            const uniqueTagRuleGroupExecId = `${tagCode.code}-${tagCode.index.toString()}-${
                ruleGroup._id.id
            }`;
            if (TagStore.tagRuleGroupExecutions.has(uniqueTagRuleGroupExecId)) {
                //rule group has applied a rule before, this is a repeat...
                const ruleStatuses = TagStore.tagRuleGroupExecutions.get(
                    uniqueTagRuleGroupExecId,
                ) as RuleStatus[];

                const latestWinningRuleStatus = ruleStatuses
                    .filter((_) => _.applied)
                    .reduce((previous, current) =>
                        previous.index > current.index ? previous : current,
                    );

                const ruleIndex = latestWinningRuleStatus.index + 1;

                const rule = Collection.findByIdThrows<Rule>(
                    'Rule',
                    latestWinningRuleStatus.ruleId,
                );

                if (ruleId === undefined || rule._id.id === ruleId) {
                    const isRepeatable = (): boolean =>
                        rule._min_repeat_interval > -1 &&
                        new Date().getTime() >=
                            latestWinningRuleStatus.ts + rule._min_repeat_interval;
                    const ruleTestStatus = testRule(rule, ruleIndex);

                    if (isRepeatable() && ruleTestStatus.passed) {
                        //as we are going to exec rule, we need to clear the event state...
                        this.resetEvents(tagCode, rule, ruleIndex);
                        //push resulting status on stack...
                        ruleStatuses.push({
                            ruleId: ruleTestStatus.ruleId,
                            applied: true,
                            ts: new Date().getTime(),
                            index: ruleIndex,
                            events: ruleTestStatus.events,
                            conditionRules: ruleTestStatus.conditionRules,
                            exceptionRules: ruleTestStatus.exceptionRules,
                            actionGroupDistributions: execRule(rule, ruleIndex),
                        });
                        TagStore.tagRuleGroupExecutions.set(uniqueTagRuleGroupExecId, ruleStatuses);
                        return {
                            ruleGroupId: ruleGroup._id.id,
                            rules: ruleStatuses,
                            applied: true,
                        };
                    }
                }
                return {
                    ruleGroupId: ruleGroup._id.id,
                    rules: ruleStatuses,
                    applied: true,
                };
            } else {
                const rules = Collection.findByIds<Rule>('Rule', ruleGroup._rule_ids);

                //only the first matching rule can win... - test every rule or impossible to debug. small penalty for this
                const ruleTests = rules.map((rule) => testRule(rule, 0));
                const ruleStatuses: RuleStatus[] = ruleTests.map((_): RuleStatus => {
                    return {
                        ruleId: _.ruleId,
                        applied: false,
                        ts: new Date().getTime(),
                        index: 0,
                        events: _.events,
                        conditionRules: _.conditionRules,
                        exceptionRules: _.exceptionRules,
                    };
                });

                const winningRule = ruleTests.find((_) => _.passed);

                if (winningRule === undefined) {
                    //no winning rule was found, but we need to return the rule statuses
                    return {
                        ruleGroupId: ruleGroup._id.id,
                        rules: ruleStatuses,
                        applied: false,
                    };
                } else {
                    //as we are going to exec rule, we need to clear the event state...
                    this.resetEvents(
                        tagCode,
                        Collection.findByIdThrows<Rule>('Rule', winningRule.ruleId),
                        0,
                    );

                    //execute the actions...
                    const statuses = [
                        {
                            ruleId: winningRule.ruleId,
                            applied: true,
                            ts: new Date().getTime(),
                            index: 0,
                            events: winningRule.events,
                            conditionRules: winningRule.conditionRules,
                            exceptionRules: winningRule.exceptionRules,
                            actionGroupDistributions: execRule(
                                Collection.findByIdThrows<Rule>('Rule', winningRule.ruleId),
                                0,
                            ),
                        },
                        ...ruleStatuses.filter((_) => _.ruleId !== winningRule.ruleId),
                    ];
                    TagStore.tagRuleGroupExecutions.set(uniqueTagRuleGroupExecId, statuses);
                    return {
                        ruleGroupId: ruleGroup._id.id,
                        rules: statuses,
                        applied: true,
                    };
                }
            }
        });

        return {
            tagCode: tagCode,
            ruleGroups: ruleGroupStatuses,
        };
    }
}
