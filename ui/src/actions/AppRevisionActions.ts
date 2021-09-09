import { PageActionProps } from './PageActions';
import {
    openDrawer,
    openFullScreenNoRefresh,
    openInfo,
    openLightbox,
    openLightboxNoRefresh,
} from '../utils/PageActionUtils';
import { AppDiff } from '../dialogPages/tagManager/app/AppDiff';
import { AppRevisionPreview } from '../dialogPages/tagManager/app/AppRevisionPreview';
import { AppRevisionUpdate } from '../dialogPages/tagManager/app/AppRevisionUpdate';
import { AppRevisionDuplicate } from '../dialogPages/tagManager/app/AppRevisionDuplicate';
import { AppRevisionFinalise } from '../dialogPages/tagManager/app/AppRevisionFinalise';
import { AppRevisionDeploy } from '../dialogPages/tagManager/app/AppRevisionDeploy';
import { AppRevisionHistory } from '../dialogPages/tagManager/app/AppRevisionHistory';

const appRevisionActions = {
    compareAppRevisions: (
        pageActionProps: PageActionProps,
        leftId: string,
        rightId: string,
    ): void => {
        openFullScreenNoRefresh(pageActionProps, AppDiff, leftId, rightId);
    },
    previewAppRevision: (pageActionProps: PageActionProps, id: string): void => {
        openLightboxNoRefresh(pageActionProps, AppRevisionPreview, id);
    },
    updateAppRevision: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, AppRevisionUpdate, id);
    },
    duplicateAppRevision: (
        pageActionProps: PageActionProps,
        id: string,
        followUp: (
            id: string,
            pageRefresh: () => void,
            handleDialogClose: (checkChanges: boolean) => void,
        ) => void,
    ): void => {
        openLightbox(pageActionProps, AppRevisionDuplicate, id, true, false, undefined, followUp);
    },
    finaliseAppRevision: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, AppRevisionFinalise, id, true, true);
    },
    finaliseAndDeployAppRevision: (
        pageActionProps: PageActionProps,
        id: string,
        followUp: (
            id: string,
            pageRefresh: () => void,
            handleDialogClose: (checkChanges: boolean) => void,
        ) => void,
    ): void => {
        openLightbox(pageActionProps, AppRevisionFinalise, id, true, true, undefined, followUp);
    },
    deployRevision: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, AppRevisionDeploy, id, true, true);
    },
    showAppRevisionHistory: (pageActionProps: PageActionProps, id: string, name: string): void => {
        openInfo(pageActionProps, AppRevisionHistory, id, name);
    },
};

export { appRevisionActions };
