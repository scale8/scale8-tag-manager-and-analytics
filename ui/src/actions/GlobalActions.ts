import { PageActionProps } from './PageActions';
import NotificationsPage from '../components/organisms/NotificationsPage';
import { openLightbox, openLightboxNoRefresh } from '../utils/PageActionUtils';
import ManageAccountPage from '../dialogPages/global/ManageAccountPage';

const globalActions = {
    manageAccount: (pageActionProps: PageActionProps): void => {
        openLightbox(pageActionProps, ManageAccountPage, undefined, false);
    },
    showNotification: (pageActionProps: PageActionProps): void => {
        openLightboxNoRefresh(pageActionProps, NotificationsPage);
    },
};

export { globalActions };
