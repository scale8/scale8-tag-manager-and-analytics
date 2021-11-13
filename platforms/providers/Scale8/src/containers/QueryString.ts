import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import {
    PlatformDataContainerChangeData,
    PlatformDataContainerGetData,
} from '../../../../common/types/Types';
import { find } from '../../../../common/lib/util/ObjectSearch';
import { getQueryStringAsObject, getTopWindow } from '../../../../common/lib/util/WindowElement';

export const queryString = {
    persistence_id: 'query-string',
    icon: TypeIcon.BROWSER_DATA_CONTAINER,
    name: 'Query String',
    description: "The query string as present in the browser's URL bar",
    allow_custom: true,
    change: (data: PlatformDataContainerChangeData): void => {
        getTopWindow().addEventListener('popstate', () => data.trigger(), false);
    },
    get: (data: PlatformDataContainerGetData) => find(getQueryStringAsObject(), data.key),
    dump: () => getQueryStringAsObject(),
};
