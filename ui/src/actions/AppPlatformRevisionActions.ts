import { PageActionProps } from './PageActions';
import { openDrawer, openInfo, openLightboxWithName } from '../utils/PageActionUtils';
import { LinkPlatformRevision } from '../dialogPages/tagManager/app/LinkPlatformRevision';
import { AppPlatformRevisionDelete } from '../dialogPages/tagManager/app/AppPlatformRevisionDelete';
import { AppPlatformRevisionUpdate } from '../dialogPages/tagManager/app/AppPlatformRevisionUpdate';
import { AppPlatformRevisionHistory } from '../dialogPages/tagManager/app/AppPlatformRevisionHistory';

const appPlatformRevisionActions = {
    linkAppPlatformRevision: (pageActionProps: PageActionProps, revisionID: string): void => {
        openDrawer(pageActionProps, LinkPlatformRevision, revisionID);
    },
    unlinkAppPlatformRevision: (
        pageActionProps: PageActionProps,
        id: string,
        name: string,
    ): void => {
        openLightboxWithName(pageActionProps, AppPlatformRevisionDelete, id, name, true, true);
    },
    updateAppPlatformRevision: (
        pageActionProps: PageActionProps,
        id: string,
        revisionID: string,
    ): void => {
        openDrawer(pageActionProps, AppPlatformRevisionUpdate, id, true, false, revisionID);
    },
    showAppPlatformRevisionHistory: (
        pageActionProps: PageActionProps,
        id: string,
        name: string,
    ): void => {
        openInfo(pageActionProps, AppPlatformRevisionHistory, id, name);
    },
};

export { appPlatformRevisionActions };
