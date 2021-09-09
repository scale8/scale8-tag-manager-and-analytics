import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openDrawerContextOnly,
    openInfo,
    openNoRefreshDrawer,
} from '../utils/PageActionUtils';
import { EnvironmentCreate } from '../dialogPages/tagManager/app/EnvironmentCreate';
import { AppEnvironmentsInstallInstructions } from '../dialogPages/tagManager/app/AppEnvironmentsInstallInstructions';
import { EnvironmentEditVariables } from '../dialogPages/tagManager/app/EnvironmentEditVariables';
import { EnvironmentUpdate } from '../dialogPages/tagManager/app/EnvironmentUpdate';
import { EnvironmentHistory } from '../dialogPages/tagManager/app/EnvironmentHistory';
import { EnvironmentDelete } from '../dialogPages/tagManager/app/EnvironmentDelete';

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
