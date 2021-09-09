import { Action, Condition, Exception, PlatformEvent, RuleEvent } from '../types/TagRulesTypes';
import { getActionIcon, getDataContainersIcon, getEventIcon } from './TypeIconsUtils';
import { LogEntry } from '../types/PreviewFrameTypes';

export type TagElementListItem = {
    id: string;
    text: string;
    icon?: JSX.Element;
    applied?: boolean;
    log?: LogEntry[];
};

const buildFullEventName = (event: RuleEvent): string => {
    const getPlatformName = (event: RuleEvent): string => {
        if (event.event.__typename === 'PlatformEvent') {
            return (event.event as any).platform.name;
        } else return '';
    };

    const platformName = getPlatformName(event);

    return `${platformName}${platformName === '' ? '' : ' - '}${event.name}`;
};

const eventsToListItems = (events: RuleEvent[]): TagElementListItem[] =>
    events.map((event: RuleEvent) => {
        const Icon = getEventIcon((event.event as PlatformEvent).icon as any);

        return {
            id: event.id,
            text: buildFullEventName(event),
            icon: <Icon />,
        };
    });

const buildFullConditionName = (condition: Condition): string => {
    const platformName = condition.platform_data_container.platform.name;
    const containerName = condition.platform_data_container.name;

    return `${platformName}  ${platformName === '' ? '' : ' - '} ${containerName} ${
        containerName === '' ? '' : ' - '
    }${condition.name}`;
};

const buildFullExceptionName = (exception: Exception): string => {
    const platformName = exception.platform_data_container.platform.name;
    const containerName = exception.platform_data_container.name;

    return `${platformName}  ${platformName === '' ? '' : ' - '} ${containerName} ${
        containerName === '' ? '' : ' - '
    }${exception.name}`;
};

const conditionsToListItems = (conditions: Condition[]): TagElementListItem[] =>
    conditions.map((condition) => {
        const Icon = getDataContainersIcon(condition.platform_data_container.icon as any);

        return {
            id: condition.id,
            text: buildFullConditionName(condition),
            icon: <Icon />,
        };
    });

const exceptionsToListItems = (exceptions: Exception[]): TagElementListItem[] =>
    exceptions.map((exception) => {
        const Icon = getDataContainersIcon(exception.platform_data_container.icon as any);

        return {
            id: exception.id,
            text: buildFullExceptionName(exception),
            icon: <Icon />,
        };
    });

const buildFullActionName = (action: Action): string => {
    const platformName = action.platform_action.platform.name;
    return `${platformName}${platformName === '' ? '' : ' - '}${action.name}`;
};
const actionsToListItems = (actions: Action[]): TagElementListItem[] =>
    actions.map((action) => {
        const Icon = getActionIcon(action.platform_action.icon as any);

        return {
            id: action.id,
            text: buildFullActionName(action),
            icon: <Icon />,
        };
    });

export {
    eventsToListItems,
    buildFullEventName,
    actionsToListItems,
    buildFullActionName,
    exceptionsToListItems,
    conditionsToListItems,
    buildFullConditionName,
};
