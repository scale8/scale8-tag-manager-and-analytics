import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { InputType } from '../../../../../common/enums/InputType';
import {
    PlatformDataContainerChangeData,
    PlatformDataContainerGetData,
} from '../../../../common/types/Types';
import ClickData from '../core/lib/ClickData';

export const elementClick = {
    persistence_id: 'element-click',
    icon: TypeIcon.BROWSER_DATA_CONTAINER,
    name: 'Element Click',
    description: 'The click data of the last clicked element',
    allow_custom: false,
    data: [
        {
            key: 'id',
            input_type: InputType.TEXT,
            description: 'The ID of the clicked element',
        },
        {
            key: 'attributes',
            input_type: InputType.OBJECT_INPUT,
            description: "A key / value list of the clicked element's attributes",
        },
        {
            key: 'classes',
            input_type: InputType.TEXT_ARRAY_INPUT,
            description: 'An array of CSS class names associated with the clicked element',
        },
    ],
    change: (data: PlatformDataContainerChangeData): void =>
        ClickData.addUpdateHook(data.ruleId, () => data.trigger()),
    get: (data: PlatformDataContainerGetData): void => ClickData.get(data.ruleId, data.key),
    dump: () => ClickData.dump(),
};
