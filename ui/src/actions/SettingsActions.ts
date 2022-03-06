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
    tagManagerPlanSelector: (
        pageActionProps: PageActionProps,
        orgId: string,
        subscriptionType: 'free' | 'paid',
        currentProductId?: string,
    ): void => {
        openDrawer(
            pageActionProps,
            ChangeTagManagerPlan,
            currentProductId,
            false,
            false,
            orgId,
            550,
            undefined,
            subscriptionType,
        );
    },
    dataManagerPlanSelector: (
        pageActionProps: PageActionProps,
        orgId: string,
        subscriptionType: 'free' | 'paid',
        currentProductId?: string,
    ): void => {
        openDrawer(
            pageActionProps,
            ChangeDataManagerPlan,
            currentProductId,
            false,
            false,
            orgId,
            550,
            undefined,
            subscriptionType,
        );
    },
};

export { settingsActions };
