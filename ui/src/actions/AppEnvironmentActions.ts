import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openDrawerContextOnly,
    openInfo,
    openNoRefreshDrawer,
} from '../utils/PageActionUtils';

import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const EnvironmentCreate = dynamic(
    () => import('../dialogPages/tagManager/app/EnvironmentCreate'),
) as FC<DialogPageProps>;

const AppEnvironmentsInstallInstructions = dynamic(
    () => import('../dialogPages/tagManager/app/AppEnvironmentsInstallInstructions'),
) as FC<DialogPageProps>;

const EnvironmentEditVariables = dynamic(
    () => import('../dialogPages/tagManager/app/EnvironmentEditVariables'),
) as FC<DialogPageProps>;

const EnvironmentUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/EnvironmentUpdate'),
) as FC<DialogPageProps>;

const EnvironmentHistory = dynamic(
    () => import('../dialogPages/tagManager/app/EnvironmentHistory'),
) as FC<DialogPageProps>;

const EnvironmentDelete = dynamic(
    () => import('../dialogPages/tagManager/app/EnvironmentDelete'),
) as FC<DialogPageProps>;

const appEnvironmentActions = {
    createAppEnvironment: (
        pageActionProps: PageActionProps,
        appId: string,
        followUp: (
            id: string,
            pageRefresh: () => void,
            handleDialogClose: (checkChanges: boolean) => void,
        ) => void,
    ): void => {
        openDrawerContextOnly(
            pageActionProps,
            EnvironmentCreate,
            appId,
            true,
            false,
            undefined,
            followUp,
        );
    },
    installAppEnvironment: (pageActionProps: PageActionProps, id: string): void => {
        openInfo(pageActionProps, AppEnvironmentsInstallInstructions, id);
    },
    editVariablesAppEnvironment: (pageActionProps: PageActionProps, id: string): void => {
        openNoRefreshDrawer(pageActionProps, EnvironmentEditVariables, id);
    },
    updateAppEnvironment: (pageActionProps: PageActionProps, id: string, appId: string): void => {
        openDrawer(pageActionProps, EnvironmentUpdate, id, true, false, appId);
    },
    deleteAppEnvironment: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, EnvironmentDelete, id);
    },
    showAppEnvironmentHistory: (
        pageActionProps: PageActionProps,
        id: string,
        name: string,
    ): void => {
        openInfo(pageActionProps, EnvironmentHistory, id, name);
    },
};

export { appEnvironmentActions };
