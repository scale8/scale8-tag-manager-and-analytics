import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { InputType } from '../../../../../common/enums/InputType';
import { inViewChecker } from '../core/funcs/InViewChecker';
import { getByTagCode } from '../../../../common/lib/util/TagElement';
import { PlatformEventCreateData, PlatformEventTestData } from '../../../../common/types/Types';

export const tagInView = {
    persistence_id: 's8-event-tag-in-view',
    icon: TypeIcon.TAG_EVENT,
    name: 'Tag In-view',
    description:
        "This event will fire when the tag's container reaches the in-view requirement specified",
    data: [
        {
            key: 'in_view_percentage',
            input_type: InputType.SELECT,
            option_values: ['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
            description: 'The percentage in-view before this event should fire',
        },
        {
            key: 'minimum_time_in_view',
            input_type: InputType.INT_INPUT,
            description:
                'The minimum duration the element must be in-view for. This is reset on any toggle of view status',
            default_value: 0,
        },
    ],
    create: (data: PlatformEventCreateData) => inViewChecker(data, getByTagCode(data.tagCode)),
    test: (data: PlatformEventTestData) => data.state.visible === true,
};
