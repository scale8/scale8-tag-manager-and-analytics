import { InputType } from '../../../../../common/enums/InputType';
import { PlatformActionData } from '../../../../common/types/Types';
import { getByTagCode } from '../../../../common/lib/util/TagElement';
import { findOrElse } from '../../../../common/lib/util/ObjectSearch';
import Frame from '../../../../common/lib/util/Frame';
import Loader from '../../../../common/lib/util/Loader';

export const loadJs = {
    persistence_id: 's8-action-load-js',
    name: 'Custom JavaScript',
    description:
        'Takes a block of custom JavaScript and will load it via an iframe inside of the requested tag',
    data: [
        {
            key: 'js',
            input_type: InputType.JAVASCRIPT,
            description: "Raw JavaScript that will be executed in it's own frame",
        },
    ],
    run: (data: PlatformActionData): void => {
        const tagElement = getByTagCode(data.tagCode);
        const js = ('<scr' +
            'ipt>' +
            findOrElse(data.props, 'js', '') +
            '</scr' +
            'ipt>') as string;
        const frame = Frame.createFrame(
            `frame-for-tag-${data.tagCode.code}-${data.tagCode.index.toFixed()}`,
            data.tagProps.width,
            data.tagProps.height,
        );
        tagElement.appendChild(frame);
        Loader.injectJS(js, frame);
    },
};
