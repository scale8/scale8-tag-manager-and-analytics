import { PageActionProps } from './PageActions';
import {
    openDrawer,
    openFullScreenNoRefresh,
    openInfo,
    openLightbox,
    openLightboxNoRefresh,
} from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

/*
import \{ (.+) \} from (.+);$

const $1 = dynamic(
    () => import($2),
) as FC<DialogPageProps>;
 */

const AppDiff = dynamic(
    () => import('../dialogPages/tagManager/app/AppDiff'),
) as FC<DialogPageProps>;

const AppRevisionPreview = dynamic(
    () => import('../dialogPages/tagManager/app/AppRevisionPreview'),
) as FC<DialogPageProps>;

const AppRevisionUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/AppRevisionUpdate'),
) as FC<DialogPageProps>;

const AppRevisionDuplicate = dynamic(
    () => import('../dialogPages/tagManager/app/AppRevisionDuplicate'),
) as FC<DialogPageProps>;

const AppRevisionFinalise = dynamic(
    () => import('../dialogPages/tagManager/app/AppRevisionFinalise'),
) as FC<DialogPageProps>;

const AppRevisionDeploy = dynamic(
    () => import('../dialogPages/tagManager/app/AppRevisionDeploy'),
) as FC<DialogPageProps>;

const AppRevisionHistory = dynamic(
    () => import('../dialogPages/tagManager/app/AppRevisionHistory'),
) as FC<DialogPageProps>;

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
