import { InputType } from '../../../../../common/enums/InputType';
import { PlatformActionData } from '../../../../common/types/Types';
import { getByTagCode } from '../../../../common/lib/util/TagElement';
import Frame from '../../../../common/lib/util/Frame';
import Loader from '../../../../common/lib/util/Loader';
import { findOrElse } from '../../../../common/lib/util/ObjectSearch';

export const loadHTML = {
    persistence_id: 's8-action-load-html',
    name: 'Custom HTML',
    description:
        'Takes a block of custom HTML and will load it via an iframe inside of the requested tag',
    data: [
        {
            key: 'html',
            input_type: InputType.HTML,
            description: "Raw HTML block that will be rendered into it's own frame",
        },
    ],
    run: (data: PlatformActionData): void => {
        const tagElement = getByTagCode(data.tagCode);
        const frame = Frame.createFrame(
            `frame-for-tag-${data.tagCode.code}-${data.tagCode.index.toFixed()}`,
            data.tagProps.width,
            data.tagProps.height,
        );
        tagElement.appendChild(frame);
        Loader.injectJS(findOrElse(data.props, 'html', ''), frame);
    },
};
