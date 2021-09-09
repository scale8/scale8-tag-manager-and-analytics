import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { PlatformEventCreateData, PlatformEventTestData } from '../../../../common/types/Types';
import ErrorData from '../core/lib/ErrorData';
import { getTopWindow } from '../../../../common/lib/util/WindowElement';

export const jsError = {
    persistence_id: 's8-event-javascript-error',
    icon: TypeIcon.CODE_EVENT,
    name: 'JavaScript Error',
    description: 'Test will return true if there was a JavaScript error',
    create: (data: PlatformEventCreateData): void => {
        getTopWindow().addEventListener(
            'error',
            (event) => {
                ErrorData.setLastError(event);
                data.state.error = true;
                data.trigger();
            },
            false,
        );
    },
    test: (data: PlatformEventTestData) => data.state.error === true,
};
