import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { PlatformEventCreateData } from '../../../../common/types/Types';
import { getTopWindow } from '../../../../common/lib/util/WindowElement';

export const pageInFocus = {
    persistence_id: 's8-event-page-focus',
    icon: TypeIcon.PAGE_EVENT,
    name: 'Page Focus',
    description: 'Test will return true only when the page is in focus',
    create: (data: PlatformEventCreateData): void => {
        getTopWindow().addEventListener('focus', () => data.trigger(), false);
        data.trigger(); //event could have fired...
    },
    test: () => getTopWindow().document.hasFocus(),
};
