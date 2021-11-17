import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openDrawerContextOnly,
    openLightbox,
} from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const PlatformCreate = dynamic(
    () => import('../dialogPages/tagManager/platform/PlatformCreate'),
) as FC<DialogPageProps>;

const PlatformUpdate = dynamic(
    () => import('../dialogPages/tagManager/platform/PlatformUpdate'),
) as FC<DialogPageProps>;

const PlatformPublish = dynamic(
    () => import('../dialogPages/tagManager/platform/PlatformPublish'),
) as FC<DialogPageProps>;

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
