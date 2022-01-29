import { PageActionProps } from './PageActions';
import { openLightbox, openLightboxNoRefresh } from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const NotificationsPage = dynamic(
    () => import('../components/organisms/NotificationsPage'),
) as FC<DialogPageProps>;

const ManageAccountPage = dynamic(
    () => import('../dialogPages/global/ManageAccountPage'),
) as FC<DialogPageProps>;

const globalActions = {
    manageAccount: (pageActionProps: PageActionProps): void => {
        openLightbox(pageActionProps, ManageAccountPage, undefined, false);
    },
    showNotification: (pageActionProps: PageActionProps): void => {
        openLightboxNoRefresh(pageActionProps, NotificationsPage);
    },
};

export { globalActions };
