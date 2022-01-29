import { PageActionProps } from './PageActions';
import { openDrawer, openInfo, openLightboxWithName } from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const LinkPlatformRevision = dynamic(
    () => import('../dialogPages/tagManager/app/LinkPlatformRevision'),
) as FC<DialogPageProps>;

const AppPlatformRevisionDelete = dynamic(
    () => import('../dialogPages/tagManager/app/AppPlatformRevisionDelete'),
) as FC<DialogPageProps>;

const AppPlatformRevisionUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/AppPlatformRevisionUpdate'),
) as FC<DialogPageProps>;

const AppPlatformRevisionHistory = dynamic(
    () => import('../dialogPages/tagManager/app/AppPlatformRevisionHistory'),
) as FC<DialogPageProps>;

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
