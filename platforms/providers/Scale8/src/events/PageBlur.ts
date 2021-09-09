import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { PlatformEventCreateData } from '../../../../common/types/Types';
import { getTopWindow } from '../../../../common/lib/util/WindowElement';

export const pageBlur = {
    persistence_id: 's8-event-page-blur',
    icon: TypeIcon.PAGE_EVENT,
    name: 'Page Blur',
    description: 'Test will return true only when the page is not in focus',
    create: (data: PlatformEventCreateData): void => {
        getTopWindow().addEventListener('blur', () => data.trigger(), false);
        data.trigger(); //event could have fired...
    },
    test: () => !getTopWindow().document.hasFocus(),
};
