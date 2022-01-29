import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openFullScreenNoRefresh,
    openLightbox,
} from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const PlatformDiff = dynamic(
    () => import('../dialogPages/tagManager/platform/PlatformDiff'),
) as FC<DialogPageProps>;

const PlatformRevisionPublish = dynamic(
    () => import('../dialogPages/tagManager/platform/PlatformRevisionPublish'),
) as FC<DialogPageProps>;

const PlatformRevisionUpdate = dynamic(
    () => import('../dialogPages/tagManager/platform/PlatformRevisionUpdate'),
) as FC<DialogPageProps>;

const PlatformRevisionDuplicate = dynamic(
    () => import('../dialogPages/tagManager/platform/PlatformRevisionDuplicate'),
) as FC<DialogPageProps>;

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
