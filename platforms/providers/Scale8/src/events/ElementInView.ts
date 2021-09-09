import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { InputType } from '../../../../../common/enums/InputType';
import { PlatformEventCreateData, PlatformEventTestData } from '../../../../common/types/Types';
import { inViewChecker } from '../core/funcs/InViewChecker';
import { find } from '../../../../common/lib/util/ObjectSearch';
import { getTopWindow } from '../../../../common/lib/util/WindowElement';

export const elementInView = {
    persistence_id: 's8-event-element-in-view',
    icon: TypeIcon.BROWSER_EVENT,
    name: 'HTML Element In-view',
    description:
        "An element will be selected via the 'selector' provided and will be monitored to see if it comes in view.",
    data: [
        {
            key: 'selector',
            input_type: InputType.DOM_SELECTOR_INPUT,
            description:
                'Any valid Document.querySelector() value. See MDN Web Docs for more information.',
        },
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
    create: (data: PlatformEventCreateData) =>
        inViewChecker(data, getTopWindow().document.querySelector(find(data.props, 'selector'))),
    test: (data: PlatformEventTestData) => data.state.visible === true && data.state.held === true,
};
