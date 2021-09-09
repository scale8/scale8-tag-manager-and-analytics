import { InputType } from '../../../../../common/enums/InputType';
import { PlatformActionData } from '../../../../common/types/Types';
import { checkFlightTime } from '../core/funcs/CheckFlightTime';
import { getFinalUrl } from '../core/funcs/GetFinalUrl';
import Loader from '../../../../common/lib/util/Loader';
import { getTopWindow } from '../../../../common/lib/util/WindowElement';

export const injectScript = {
    persistence_id: 's8-action-inject-script',
    name: 'Inject Script',
    description:
        'This action will inject a script into the page. This is commonly used to load another third party library.',
    data: [
        {
            key: 'url',
            input_type: InputType.URL_WITH_MACRO_SUPPORT,
            description: 'Script URL that will be called by the action.',
            optional: false,
        },
        {
            key: 'use_cache_buster',
            input_type: InputType.RADIO,
            option_values: ['Enabled', 'Disabled'],
            default_value: 'Enabled',
            description:
                'By default enabled. It will add a random parameter to the end of the provided URL to prevent caching.',
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
            const scriptUrl = getFinalUrl(
                data.macroReplace(data.props.url),
                data.props.use_cache_buster === 'Enabled',
            );
            log(`Script URL: ${scriptUrl}`);
            Loader.loadJS(
                scriptUrl,
                getTopWindow(),
                () => log('Successfully loaded script'),
                () =>
                    err(
                        'Failed to load script, something has gone wrong. Check the browser network tab for more information about the request',
                    ),
            );
        } else {
            log(
                'Unable to load script as not permitted within the time window provided in action setup',
            );
        }
    },
};
