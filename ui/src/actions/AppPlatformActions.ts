import { PageActionProps } from './PageActions';
import { openDrawerContextOnly } from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const InstallAppPlatform = dynamic(
    () => import('../dialogPages/tagManager/app/InstallAppPlatform'),
) as FC<DialogPageProps>;

const appPlatformActions = {
    installAppPlatform: (pageActionProps: PageActionProps, appId: string): void => {
        openDrawerContextOnly(pageActionProps, InstallAppPlatform, appId);
    },
};

export { appPlatformActions };
