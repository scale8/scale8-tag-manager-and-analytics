import { FC } from 'react';
import { PageActionProps, pageActions } from '../../../actions/PageActions';
import { Trigger } from '../../../types/TagRulesTypes';
import TagElementList from '../../molecules/TagElementList';
import {
    conditionsToListItems,
    eventsToListItems,
    exceptionsToListItems,
} from '../../../utils/ElementListUtils';

type TriggerSectionProps = {
    trigger: Trigger;
    readonly: boolean;
    pageActionProps: PageActionProps;
};

const TriggerSection: FC<TriggerSectionProps> = (props: TriggerSectionProps) => {
    const { trigger, readonly, pageActionProps } = props;

    return (
        <>
            <TagElementList
                disabled={readonly}
                title="Events"
                addButtonText="Add Event"
                items={eventsToListItems(trigger.events)}
                addButtonClick={() => pageActions.createEvent(pageActionProps, trigger.id)}
                historyButtonClick={(id: string, name: string) =>
                    pageActions.showEventHistory(pageActionProps, id, name)
                }
                deleteButtonClick={(id: string, name: string) =>
                    pageActions.deleteEvent(pageActionProps, id, name)
                }
                editButtonClick={(id: string) =>
                    pageActions.updateEvent(pageActionProps, id, trigger.id)
                }
                inspectButtonClick={(id: string) => pageActions.inspectEvent(pageActionProps, id)}
            />
            <TagElementList
                disabled={readonly}
                title="Conditions"
                addButtonText="Add Condition"
                items={conditionsToListItems(trigger.condition_rules)}
                addButtonClick={() => pageActions.createCondition(pageActionProps, trigger.id)}
                editButtonClick={(id: string) =>
                    pageActions.updateCondition(pageActionProps, id, trigger.id)
                }
                historyButtonClick={(id: string, name: string) =>
                    pageActions.showConditionHistory(pageActionProps, id, name)
                }
                deleteButtonClick={(id: string, name: string) =>
                    pageActions.deleteCondition(pageActionProps, id, name)
                }
            />
            <TagElementList
                disabled={readonly}
                title="Exceptions"
                addButtonText="Add Exception"
                items={exceptionsToListItems(trigger.exception_rules)}
                addButtonClick={() => pageActions.createException(pageActionProps, trigger.id)}
                editButtonClick={(id: string) =>
                    pageActions.updateException(pageActionProps, id, trigger.id)
                }
                historyButtonClick={(id: string, name: string) =>
                    pageActions.showExceptionHistory(pageActionProps, id, name)
                }
                deleteButtonClick={(id: string, name: string) =>
                    pageActions.deleteException(pageActionProps, id, name)
                }
            />
        </>
    );
};

export { TriggerSection };
