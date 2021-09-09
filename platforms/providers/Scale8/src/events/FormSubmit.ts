import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { InputType } from '../../../../../common/enums/InputType';
import { PlatformEventCreateData, PlatformEventTestData } from '../../../../common/types/Types';
import { find } from '../../../../common/lib/util/ObjectSearch';
import { getTopWindow } from '../../../../common/lib/util/WindowElement';

export const formSubmit = {
    persistence_id: 's8-event-form-submit',
    name: 'HTML Form Submit',
    icon: TypeIcon.BROWSER_EVENT,
    description:
        "An element will be selected via the 'selector' provided and a form submit event listener will be added to it.",
    data: [
        {
            key: 'selector',
            input_type: InputType.DOM_SELECTOR_INPUT,
            description:
                'Any valid Document.querySelector() value. See MDN Web Docs for more information.',
        },
    ],
    create: (
        data: PlatformEventCreateData,
        log: (msg: string) => void,
        err: (msg: string) => void,
    ): void => {
        const selector = find(data.props, 'selector');
        const elm = getTopWindow().document.querySelector(selector);
        if (elm !== null && elm.nodeName === 'FORM') {
            elm.addEventListener(
                'submit',
                () => {
                    data.state.submitted = true;
                    data.trigger();
                },
                false,
            );
        } else {
            err('Unable to find form using the selector provided');
        }
    },
    test: (data: PlatformEventTestData) => data.state.submitted === true,
};
