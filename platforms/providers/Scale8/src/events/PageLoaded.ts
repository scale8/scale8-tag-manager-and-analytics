import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import DOM from '../../../../common/lib/util/DOM';
import { PlatformEventCreateData, PlatformEventTestData } from '../../../../common/types/Types';

export const pageLoaded = {
    persistence_id: 's8-event-page-loaded',
    icon: TypeIcon.PAGE_EVENT,
    name: 'Page Loaded',
    description: 'Test will return true when the DOM is ready and all resources have been loaded',
    create: (data: PlatformEventCreateData) =>
        DOM.isLoaded(() => {
            data.state.loaded = true;
            data.trigger();
        }),
    test: (data: PlatformEventTestData) => data.state.loaded === true,
};
