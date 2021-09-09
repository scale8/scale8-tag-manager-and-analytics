import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { PlatformEventCreateData, PlatformEventTestData } from '../../../../common/types/Types';
import { getByTagCode } from '../../../../common/lib/util/TagElement';
import ClickData from '../core/lib/ClickData';

export const tagClick = {
    persistence_id: 's8-event-tag-click',
    icon: TypeIcon.TAG_EVENT,
    name: 'Tag Click',
    description: "This event will fire if the tag's container is clicked",
    create: (data: PlatformEventCreateData): void => {
        getByTagCode(data.tagCode).addEventListener(
            'click',
            (e) => {
                if (e.target !== null) {
                    ClickData.setClickElement(data.ruleId, e.target);
                }
                data.state.clicked = true;
                data.trigger();
            },
            false,
        );
    },
    test: (data: PlatformEventTestData) => data.state.clicked === true,
};
