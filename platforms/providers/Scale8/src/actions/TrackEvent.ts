import { InputType } from '../../../../../common/enums/InputType';
import { PlatformActionData } from '../../../../common/types/Types';
import EventTracking from '../core/lib/EventTracking';

export const trackEvent = {
    persistence_id: 's8-track-event',
    name: 'Track Event',
    description: "Track this event in Tag Manager's analytics",
    data: [
        {
            key: 'event',
            input_type: InputType.TEXT_WITH_MACRO_SUPPORT,
            description: 'Name of the event to be tracked',
            optional: false,
        },
        {
            key: 'event_group',
            input_type: InputType.TEXT_WITH_MACRO_SUPPORT,
            description: 'Name of the event group that is associated with this event',
            optional: true,
        },
    ],
    run: async (
        data: PlatformActionData,
        log: (msg: string) => void,
        err: (msg: string) => void,
    ): Promise<any> => {
        const event = data.macroReplace(data.props.event || '') as string;
        if (event.length === 0) {
            err(`Event name is not valid`);
        }
        const eventGroup = data.macroReplace(data.props.event_group || '') as string;
        return EventTracking.track(event, eventGroup === '' ? undefined : eventGroup);
    },
};
