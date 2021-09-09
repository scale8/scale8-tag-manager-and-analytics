import { InputType } from '../../../../../common/enums/InputType';
import { PlatformActionData } from '../../../../common/types/Types';
import { checkFlightTime } from '../core/funcs/CheckFlightTime';
import { getFinalUrl } from '../core/funcs/GetFinalUrl';
import Pixel from '../../../../common/lib/util/Pixel';
import { getTopWindow } from '../../../../common/lib/util/WindowElement';

export const firePixel = {
    persistence_id: 's8-action-fire-pixel',
    name: 'Fire Image Pixel',
    description:
        'This action will create a custom hidden image tag used to trigger a tracking pixel.',
    data: [
        {
            key: 'image_url',
            input_type: InputType.URL_WITH_MACRO_SUPPORT,
            description: 'Image URL that will be called by the action.',
            optional: false,
        },
        {
            key: 'use_cache_buster',
            input_type: InputType.RADIO,
            option_values: ['Enabled', 'Disabled'],
            default_value: 'Enabled',
            description:
                'By default enabled. It will add a random parameter to the end of the provided image URL to prevent caching.',
            optional: false,
        },
        {
            key: 'start_date',
            input_type: InputType.DATETIME_STRING,
            description: 'Optional start date',
            optional: true,
        },
        {
            key: 'end_date',
            input_type: InputType.DATETIME_STRING,
            description: 'Optional end date',
            optional: true,
        },
    ],
    run: async (
        data: PlatformActionData,
        log: (msg: string) => void,
        err: (msg: string) => void,
    ): Promise<void> => {
        if (checkFlightTime(data.props.start_date, data.props.end_data)) {
            const imageUrl = getFinalUrl(
                data.macroReplace(data.props.image_url),
                data.props.use_cache_buster === 'Enabled',
            );
            log(`Pixel URL: ${imageUrl}`);
            getTopWindow().document.body.appendChild(
                Pixel.create(
                    imageUrl,
                    () => log('Successfully fired pixel'),
                    () =>
                        err(
                            'Failed to fire pixel, something has gone wrong. Check browser network tab for more information about the request',
                        ),
                ),
            );
        } else {
            log(
                'Unable to fire pixel as not permitted within the time window provided in action setup',
            );
        }
    },
};
