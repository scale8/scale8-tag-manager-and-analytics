import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { InputType } from '../../../../../common/enums/InputType';
import { find } from '../../../../common/lib/util/ObjectSearch';
import { PlatformDataContainerGetData } from '../../../../common/types/Types';

const browserData = {
    language: navigator.language || '',
    cookies_enabled: navigator.cookieEnabled === true,
    is_online: navigator.onLine === true,
    user_agent: navigator.userAgent || '',
};

export const browser = {
    persistence_id: 'browser',
    icon: TypeIcon.BROWSER_DATA_CONTAINER,
    name: 'Scale8 Browser Details',
    description: 'A data layer describing all the accessible properties within the Scale8 core',
    allow_custom: false,
    data: [
        {
            key: 'language',
            input_type: InputType.TEXT,
            description:
                'The current browser detected language in ISO Language Code format. e.g. en-GB, en-US, de-AT.',
        },
        {
            key: 'cookies_enabled',
            input_type: InputType.TEXT,
            description: 'If the current browser supports cookies',
        },
        {
            key: 'is_online',
            input_type: InputType.TEXT,
            description: 'If the current browser has an active internet connection',
        },
        {
            key: 'user_agent',
            input_type: InputType.TEXT,
            description: "The browser's user agent string, in full.",
        },
    ],
    get: (data: PlatformDataContainerGetData) => find(browserData, data.key),
    dump: () => browserData,
};
