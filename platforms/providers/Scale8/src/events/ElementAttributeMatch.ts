import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { InputType } from '../../../../../common/enums/InputType';
import { PlatformEventCreateData, PlatformEventTestData } from '../../../../common/types/Types';
import { find } from '../../../../common/lib/util/ObjectSearch';
import Match from '../../../../common/lib/util/Match';
import { getTopWindow } from '../../../../common/lib/util/WindowElement';

export const elementAttributeMatch = {
    persistence_id: 's8-event-element-attribute-match',
    name: 'HTML Element Attribute Match',
    icon: TypeIcon.BROWSER_EVENT,
    description: "Test for an HTML element's attribute to match some provided value",
    data: [
        {
            key: 'selector',
            input_type: InputType.DOM_SELECTOR_INPUT,
            description:
                'Any valid Document.querySelector() value. See MDN Web Docs for more information.',
        },
        {
            key: 'attribute',
            input_type: InputType.TEXT,
            description:
                "The name of the HTML element's attribute that holds the value to be compared",
        },
        {
            key: 'condition',
            input_type: InputType.GENERIC_CONDITION,
            description:
                "A condition that should match the HTML element's attribute to the provided value",
        },
        {
            key: 'value',
            input_type: InputType.TEXT,
            description:
                "The value that will be compared to the HTML element's attribute value via the condition specified",
        },
    ],
    create: (
        data: PlatformEventCreateData,
        log: (msg: string) => void,
        err: (msg: string) => void,
    ): void => {
        const selector = find(data.props, 'selector');
        const condition = find(data.props, 'condition');
        const attribute = find(data.props, 'attribute');
        const rightValue = find(data.props, 'value');
        const elm = getTopWindow().document.querySelector(selector);
        const testElement = (): boolean => {
            if (elm === null) {
                err('Unable to find element using selector provided');
                return false;
            } else {
                const check = Match.check(
                    (elm as HTMLElement).getAttribute(attribute),
                    rightValue,
                    condition,
                );
                if (!check.passing) {
                    log(check.info);
                }
                return check.passing;
            }
        };
        if (elm !== null) {
            const observer = new MutationObserver(() => {
                data.state.ok = testElement();
                data.trigger();
            });
            observer.observe(elm, {
                attributes: true,
            });
        }
        data.state.ok = testElement();
        data.trigger();
    },
    test: (data: PlatformEventTestData) => data.state.ok === true,
};
