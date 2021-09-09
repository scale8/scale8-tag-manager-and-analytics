import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { InputType } from '../../../../../common/enums/InputType';
import { PlatformEventCreateData, PlatformEventTestData } from '../../../../common/types/Types';
import ClickData from '../core/lib/ClickData';
import { find } from '../../../../common/lib/util/ObjectSearch';
import DOMObserver from '../core/lib/DOMObserver';
import { getTopWindow } from '../../../../common/lib/util/WindowElement';

export const clickElements = {
    persistence_id: 's8-event-click-elements',
    icon: TypeIcon.BROWSER_EVENT,
    name: 'Click Elements',
    description:
        "Elements will be selected via the 'selector' provided and a click event listener will be added to it.",
    data: [
        {
            key: 'selector',
            input_type: InputType.DOM_SELECTOR_INPUT,
            description:
                'Any valid Document.querySelector() value. See MDN Web Docs for more information.',
        },
    ],
    create: (data: PlatformEventCreateData): void => {
        const listener = (e: MouseEvent) => {
            if (e.target !== null) {
                ClickData.setClickElement(data.ruleId, e.target);
            }
            data.state.clicked = true;
            data.trigger();
        };
        const selector = find(data.props, 'selector');
        const bind = () => {
            const elms = getTopWindow().document.querySelectorAll(selector);
            elms.forEach((elm) => {
                (elm as HTMLElement).addEventListener('click', listener, false);
            });
        };
        bind();
        DOMObserver.addDOMTreeChangeHook(() => bind());
    },
    test: (data: PlatformEventTestData) => data.state.clicked === true,
};
