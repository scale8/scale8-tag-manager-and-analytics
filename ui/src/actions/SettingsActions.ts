import { PageActionProps } from './PageActions';
import { openDrawer } from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const ChangeTagManagerPlan = dynamic(
    () => import('../dialogPages/global/ChangeTagManagerPlan'),
) as FC<DialogPageProps>;
const ChangeDataManagerPlan = dynamic(
    () => import('../dialogPages/global/ChangeDataManagerPlan'),
) as FC<DialogPageProps>;

const settingsActions = {
    tagManagerPlanSelector: (pageActionProps: PageActionProps, currentProductId?: string): void => {
        openDrawer(pageActionProps, ChangeTagManagerPlan, currentProductId, false, false, undefined, 550);
    },
    dataManagerPlanSelector: (
        pageActionProps: PageActionProps,
        currentProductId?: string,
    ): void => {
        openDrawer(pageActionProps, ChangeDataManagerPlan, currentProductId, false, false, undefined, 550);
    },
};

export { settingsActions };
