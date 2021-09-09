import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { InputType } from '../../../../../common/enums/InputType';
import { PlatformEventCreateData, PlatformEventTestData } from '../../../../common/types/Types';

export const tagTimer = {
    persistence_id: 's8-event-tag-timer',
    icon: TypeIcon.TAG_EVENT,
    name: 'Tag Timer',
    description:
        'Once the tag is called, the timer is set and the event will trigger once the delay time has elapsed',
    data: [
        {
            key: 'delay',
            input_type: InputType.INT_INPUT,
            description: 'The delay in milliseconds before the event should fire',
        },
    ],
    create: (data: PlatformEventCreateData): void => {
        setTimeout(() => {
            data.state.triggered = true;
            data.trigger();
        }, data.props.delay || 0);
    },
    test: (data: PlatformEventTestData) => data.state.triggered === true,
};
