import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openDrawerContextOnly,
    openLightboxNoRefresh,
} from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const AppCreate = dynamic(
    () => import('../dialogPages/tagManager/app/AppCreate'),
) as FC<DialogPageProps>;

const AppDelete = dynamic(
    () => import('../dialogPages/tagManager/app/AppDelete'),
) as FC<DialogPageProps>;

const AppUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/AppUpdate'),
) as FC<DialogPageProps>;

const AppInstallInstructions = dynamic(
    () => import('../dialogPages/tagManager/app/AppInstallInstructions'),
) as FC<DialogPageProps>;

const applicationActions = {
    createApplication: (
        pageActionProps: PageActionProps,
        accountID: string,
        followUp: (
            id: string,
            pageRefresh: () => void,
            handleDialogClose: (checkChanges: boolean) => void,
        ) => void,
    ): void => {
        openDrawerContextOnly(
            pageActionProps,
            AppCreate,
            accountID,
            true,
            false,
            undefined,
            followUp,
        );
    },
    deleteApplication: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, AppDelete, id);
    },
    updateApplication: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, AppUpdate, id);
    },
    installApp: (pageActionProps: PageActionProps, id: string): void => {
        openLightboxNoRefresh(pageActionProps, AppInstallInstructions, id);
    },
};

export { applicationActions };
