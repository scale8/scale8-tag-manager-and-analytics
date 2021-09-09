import { InputType } from '../../../../../common/enums/InputType';
import { PlatformActionData } from '../../../../common/types/Types';
import { checkFlightTime } from '../core/funcs/CheckFlightTime';
import { getFinalUrl } from '../core/funcs/GetFinalUrl';
import Frame from '../../../../common/lib/util/Frame';
import { getTopWindow } from '../../../../common/lib/util/WindowElement';

export const createHiddenFrame = {
    persistence_id: 's8-action-create-hidden-iframe',
    name: 'Create Hidden iFrame',
    description:
        'This action will create a custom hidden iFrame. It is commonly used to load another library or sync pixels.',
    data: [
        {
            key: 'url',
            input_type: InputType.URL_WITH_MACRO_SUPPORT,
            description: 'iFrame URL that will be called by the action.',
            optional: false,
        },
        {
            key: 'use_cache_buster',
            input_type: InputType.RADIO,
            option_values: ['Enabled', 'Disabled'],
            default_value: 'Enabled',
            description:
                'By default enabled. It will add a random parameter to the end of the provided iFrame URL to prevent caching.',
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
            const frameUrl = getFinalUrl(
                data.macroReplace(data.props.url),
                data.props.use_cache_buster === 'Enabled',
            );
            log(`iFrame URL: ${frameUrl}`);
            getTopWindow().document.body.appendChild(
                Frame.createHiddenFrame(
                    frameUrl,
                    () => log('Successfully created hidden iFrame'),
                    () =>
                        err(
                            'Failed to create hidden iFrame, something has gone wrong. Check the browser network tab for more information about the request',
                        ),
                ),
            );
        } else {
            log(
                'Unable to create hidden iFrame as not permitted within the time window provided in action setup',
            );
        }
    },
};
