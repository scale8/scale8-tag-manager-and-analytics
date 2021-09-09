import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openFullScreenNoRefresh,
    openLightbox,
} from '../utils/PageActionUtils';
import { PlatformDiff } from '../dialogPages/tagManager/platform/PlatformDiff';
import { PlatformRevisionPublish } from '../dialogPages/tagManager/platform/PlatformRevisionPublish';
import { PlatformRevisionUpdate } from '../dialogPages/tagManager/platform/PlatformRevisionUpdate';
import { PlatformRevisionDuplicate } from '../dialogPages/tagManager/platform/PlatformRevisionDuplicate';

const platformRevisionActions = {
    comparePlatformRevisions: (
        pageActionProps: PageActionProps,
        leftId: string,
        rightId: string,
    ): void => {
        openFullScreenNoRefresh(pageActionProps, PlatformDiff, leftId, rightId);
    },
    publishPlatformRevision: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(
            pageActionProps,
            PlatformRevisionPublish,
            id,
            undefined,
            undefined,
            true,
            false,
        );
    },
    updatePlatformRevision: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, PlatformRevisionUpdate, id);
    },
    duplicatePlatformRevision: (
        pageActionProps: PageActionProps,
        id: string,
        followUp: (
            id: string,
            pageRefresh: () => void,
            handleDialogClose: (checkChanges: boolean) => void,
        ) => void,
    ): void => {
        openLightbox(
            pageActionProps,
            PlatformRevisionDuplicate,
            id,
            true,
            false,
            undefined,
            followUp,
        );
    },
};

export { platformRevisionActions };
