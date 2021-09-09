import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openDrawerContextOnly,
    openLightbox,
} from '../utils/PageActionUtils';
import { PlatformCreate } from '../dialogPages/tagManager/platform/PlatformCreate';
import { PlatformUpdate } from '../dialogPages/tagManager/platform/PlatformUpdate';
import { PlatformPublish } from '../dialogPages/tagManager/platform/PlatformPublish';

const platformActions = {
    createPlatform: (pageActionProps: PageActionProps, developerAccountId: string): void => {
        openDrawerContextOnly(pageActionProps, PlatformCreate, developerAccountId);
    },
    createPlatformNonAdmin: (pageActionProps: PageActionProps, accountId: string): void => {
        openLightbox(pageActionProps, PlatformCreate, accountId);
    },
    updatePlatform: (pageActionProps: PageActionProps, id: string, accountId: string): void => {
        openDrawer(pageActionProps, PlatformUpdate, id, true, false, accountId);
    },
    publishPlatform: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, PlatformPublish, id, undefined, undefined, true, false);
    },
};

export { platformActions };
