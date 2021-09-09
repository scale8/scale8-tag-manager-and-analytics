import TagStore from './TagStore';
import EventStore from './EventStore';
import RevisionStatusManager from '../debug/RevisionStatusManager';
import Logger from '../../../../../common/lib/util/Logger';
import {
    Tag,
    Rule,
    Trigger,
    ConditionRule,
    PlatformDataContainer,
    Event,
    PlatformEvent,
    DataMap,
    RuleGroup,
} from '../config/ModelTypes';
import Collection from '../config/Collection';
import { dataMapToObject } from '../funcs/DataMapToObject';
import PlatformDataContainerRegister from './PlatformDataContainerRegister';
import RuleExecutor from './RuleExecutor';
import PlatformEventRegister from './PlatformEventRegister';
import { createLogHandler } from '../funcs/CreateLogHandler';
import { getTopWindow } from '../../../../../common/lib/util/WindowElement';
import { TagCode } from '../../../../../common/types/Types';
import { getByTagCode } from '../../../../../common/lib/util/TagElement';

export default class TagManager {
    private static addTag(tag: HTMLElement): void {
        if (tag.getAttribute('data-index') === null) {
            const code = tag.getAttribute('data-code');
            Logger.debug('Found Tag: ', code);
            if (code === null) {
                throw new Error('Failed to get code from tag');
            } else {
                const newIndex = TagStore.nextIndex;
                tag.setAttribute('data-index', newIndex.toFixed());
                const tagCode = {
                    code: code,
                    index: newIndex,
                };
                TagStore.registeredTags.set(`${code}-${newIndex}`, tagCode);
                TagStore.nextIndex += 1;
                this.configureTag(tagCode);
            }
        }
    }

    private static findTags(): void {
        Array.from(getTopWindow().document.querySelectorAll('[data-s8]')).forEach((tag) =>
            this.addTag(tag as HTMLElement),
        );
    }

    public static autoLoadTags(): void {
        Collection.find<Tag>('Tag')
            .filter((_) => _._auto_load)
            .forEach((tag) => {
                //add this to the body...
                const tagElement = document.createElement('div');
                tagElement.setAttribute('data-s8', 'true');
                tagElement.setAttribute('data-code', tag._tag_code);
                tagElement.style.display = 'none';
                getTopWindow().document.body.appendChild(tagElement);
            });
    }

    public static monitorPage(): void {
        //we need to call this method first as we never know the point we actually load in.
        this.findTags();
        //from here we can use an event to let us know that some element has been added
        new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutationRecord) => {
                if (mutationRecord.type === 'childList') {
                    //something has been added (or removed)
                    mutationRecord.addedNodes.forEach((addedNode) => {
                        if (addedNode.nodeName === 'DIV') {
                            const elm = addedNode as HTMLElement;
                            if (elm.getAttribute('data-s8') !== null) {
                                this.addTag(elm);
                            }
                        }
                    });
                }
            });
        }).observe(getTopWindow().document.body, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    }

    public static getRegisteredTags(): TagCode[] {
        return Array.from(TagStore.registeredTags.values());
    }

    private static applyStyling(tagElement: HTMLElement, tag: Tag): void {
        tagElement.style.position = 'relative';
        tagElement.style.margin = '0 auto';
        tagElement.style.width = `${tag._width}px`;
        tagElement.style.height = `${tag._height}px`;
    }

    private static getTriggerFromRule(rule: Rule): Trigger {
        return typeof rule._global_trigger_id === 'string'
            ? Collection.findOneThrows<Trigger>('Trigger', {
                  ___persisting_id: rule._global_trigger_id,
              })
            : Collection.findByIdThrows<Trigger>('Trigger', rule._custom_trigger_id);
    }

    private static addConditionRuleTriggers(rule: Rule, tagCode: TagCode): void {
        //register handler for condition / exception rules...
        const trigger = this.getTriggerFromRule(rule);
        Collection.findByIds<ConditionRule>('ConditionRule', [
            ...trigger._condition_rule_ids,
            ...trigger._exception_rule_ids,
        ]).forEach((conditionRule) => {
            const platformDataContainer = Collection.findByIdThrows<PlatformDataContainer>(
                'PlatformDataContainer',
                conditionRule._platform_data_container_id,
            );
            const dataContainerFunctions = PlatformDataContainerRegister.getDataContainerFunctions(
                platformDataContainer._platform_id.id,
                platformDataContainer.___persisting_id,
            );

            if (dataContainerFunctions.change !== undefined) {
                //underlying data container could change...
                const dispatchEvent = new CustomEvent(conditionRule._id.id, {
                    detail: { tagCode: tagCode, ruleId: rule._id.id },
                });

                const logHandler = createLogHandler('LOG', tagCode, rule, 0, conditionRule);
                const errHandler = createLogHandler('ERR', tagCode, rule, 0, conditionRule);

                try {
                    logHandler('Data container layer has been changed');
                    dataContainerFunctions.change(
                        {
                            ruleId: rule._id.id,
                            tagCode: tagCode,
                            trigger: () => {
                                //dumpDataContainer();
                                getTopWindow().dispatchEvent(dispatchEvent);
                            },
                        },
                        logHandler,
                        errHandler,
                    );
                } catch (e) {
                    if (e instanceof Error) {
                        errHandler(e.message);
                    } else if (typeof e === 'string') {
                        errHandler(e);
                    } else {
                        errHandler('Something has gone wrong');
                    }
                }

                getTopWindow().addEventListener(
                    dispatchEvent.type,
                    (e) => {
                        //re-process tags...
                        const tagCode = (e as any).detail?.tagCode;
                        const ruleId = (e as any).detail?.ruleId;
                        if (tagCode === undefined || ruleId === undefined) {
                            throw new Error('Failed to get tag code from condition rule handler');
                        } else {
                            RevisionStatusManager.updateTagStatus(
                                RuleExecutor.checkTagRules(tagCode, ruleId),
                            );
                        }
                    },
                    false,
                );
            }
        });
    }

    private static addEventTriggers(rule: Rule, tag: Tag, tagCode: TagCode): void {
        //register handler for events...
        const w = getTopWindow();
        const trigger = this.getTriggerFromRule(rule);
        Collection.findByIds<Event>('Event', trigger._event_ids).forEach((event) => {
            const clearEventState: () => any = () => {
                if (event._clear_state_ms > -1) {
                    return setTimeout(() => {
                        EventStore.clearEventState(event._id.id, tagCode);
                        //after clearing event state, need to dispatch again...
                        const customBrowserEvent = EventStore.getCustomBrowserEvent(
                            event._id.id,
                            tagCode,
                        );
                        w.dispatchEvent(customBrowserEvent.customEvent);
                    }, event._clear_state_ms);
                }
                return undefined;
            };
            const listenTo = (eventState: { [k: string]: any }): CustomEvent => {
                const dispatchEvent = new CustomEvent(
                    EventStore.getStoreKey(event._id.id, tagCode),
                    {
                        detail: { tagCode: tagCode, ruleId: rule._id.id },
                    },
                );
                if (typeof event._event === 'string') {
                    //we have a custom event, this must be broadcast at the window level to be compliant
                    w.addEventListener(
                        event._event,
                        () => {
                            //clear out the old timer and replace with new timer...
                            EventStore.setCustomEventResetStateTimeout(
                                event._id.id,
                                tagCode,
                                clearEventState(),
                            );
                            eventState.triggered = true;
                            w.dispatchEvent(dispatchEvent);
                        },
                        false,
                    );
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

                    const logHandler = createLogHandler('LOG', tagCode, rule, 0, event);
                    const errHandler = createLogHandler('ERR', tagCode, rule, 0, event);

                    try {
                        logHandler('Creating event');
                        eventFunctions.create(
                            {
                                ruleId: rule._id.id,
                                trigger: () => {
                                    EventStore.setCustomEventResetStateTimeout(
                                        event._id.id,
                                        tagCode,
                                        clearEventState(),
                                    );
                                    w.dispatchEvent(dispatchEvent);
                                },
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
                    } catch (e) {
                        if (e instanceof Error) {
                            errHandler(e.message);
                        } else if (typeof e === 'string') {
                            errHandler(e);
                        } else {
                            errHandler('Something has gone wrong');
                        }
                    }
                }
                return dispatchEvent;
            };
            //create and set event state...
            const eventState = EventStore.getEventState(event._id.id, tagCode);
            const dispatchEvent = listenTo(eventState);
            EventStore.setCustomBrowserEvent(
                event._id.id,
                tagCode,
                dispatchEvent,
                clearEventState(),
            );

            //listen for event dispatch...
            w.addEventListener(
                dispatchEvent.type,
                (e) => {
                    //re-process tags...
                    const tagCode = (e as any).detail?.tagCode;
                    const ruleId = (e as any).detail?.ruleId;
                    if (tagCode === undefined || ruleId === undefined) {
                        throw new Error('Failed to get tag code from event handler');
                    } else {
                        RevisionStatusManager.updateTagStatus(
                            RuleExecutor.checkTagRules(tagCode, ruleId),
                        );
                    }
                },
                false,
            );
        });
    }

    private static configureTag(tagCode: TagCode): void {
        const tagElement = getByTagCode(tagCode);
        const tag = Collection.findOneThrows<Tag>('Tag', {
            _tag_code: tagCode.code,
        });
        //apply some basic styling...
        this.applyStyling(tagElement, tag);
        //update create highlight placeholder...
        this.buildHighlighterContainer(tagElement, tag);
        //register events here...

        Collection.findByIds<RuleGroup>('RuleGroup', tag._rule_group_ids).forEach((ruleGroup) => {
            Collection.findByIds<Rule>('Rule', ruleGroup._rule_ids).forEach((rule) => {
                this.addEventTriggers(rule, tag, tagCode);
                this.addConditionRuleTriggers(rule, tagCode);
            });
        });
        RevisionStatusManager.updateTagStatus(RuleExecutor.checkTagRules(tagCode));
    }

    private static buildHighlighterContainer(tagElement: HTMLElement, tag: Tag): void {
        const highlighterContainer = document.createElement('div');
        highlighterContainer.classList.add('highlighter');
        highlighterContainer.style.display = 'none';
        highlighterContainer.style.position = 'absolute';
        highlighterContainer.style.top = '0';
        highlighterContainer.style.left = '0';
        highlighterContainer.style.zIndex = '2147483646';
        highlighterContainer.style.width = `${tag._width}px`;
        highlighterContainer.style.height = `${tag._height}px`;
        tagElement.appendChild(highlighterContainer);
    }
}
