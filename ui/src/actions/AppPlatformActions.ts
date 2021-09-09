import { PageActionProps } from './PageActions';
import { openDrawerContextOnly } from '../utils/PageActionUtils';
import { InstallAppPlatform } from '../dialogPages/tagManager/app/InstallAppPlatform';

const appPlatformActions = {
    installAppPlatform: (pageActionProps: PageActionProps, appId: string): void => {
        openDrawerContextOnly(pageActionProps, InstallAppPlatform, appId);
    },
};

export { appPlatformActions };
