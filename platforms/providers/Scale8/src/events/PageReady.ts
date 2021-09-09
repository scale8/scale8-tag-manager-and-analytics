import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import DOM from '../../../../common/lib/util/DOM';
import { PlatformEventCreateData, PlatformEventTestData } from '../../../../common/types/Types';

export const pageReady = {
    persistence_id: 's8-event-page-ready',
    icon: TypeIcon.PAGE_EVENT,
    name: 'Page Ready',
    description: 'Test will return true when the DOM is ready',
    create: (data: PlatformEventCreateData) =>
        DOM.isReady(() => {
            data.state.ready = true;
            data.trigger();
        }),
    test: (data: PlatformEventTestData) => data.state.ready === true,
};
