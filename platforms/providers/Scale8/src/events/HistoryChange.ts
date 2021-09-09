import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { PlatformEventCreateData, PlatformEventTestData } from '../../../../common/types/Types';
import { getTopWindow } from '../../../../common/lib/util/WindowElement';

export const historyChange = {
    persistence_id: 's8-event-history-change',
    icon: TypeIcon.BROWSER_EVENT,
    name: 'History Change',
    description: 'Test will return true if the query string has been changed',
    create: (data: PlatformEventCreateData): void => {
        const topWindow = getTopWindow();
        if (typeof topWindow.history.pushState === 'function') {
            const pushState = topWindow.history.pushState;
            topWindow.history.pushState = (...args) => {
                pushState.apply(topWindow.history, args);
                data.state.changed = true;
                data.trigger();
            };
        }
        topWindow.addEventListener(
            'popstate',
            () => {
                data.state.changed = true;
                data.trigger();
            },
            false,
        );
    },
    test: (data: PlatformEventTestData) => data.state.changed === true,
};
