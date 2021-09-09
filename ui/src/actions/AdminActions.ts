import { PageActionProps } from './PageActions';
import { launchHidden } from '../utils/PageActionUtils';
import { AdminSignUpApprove } from '../dialogPages/global/AdminSignUpApprove';

const adminActions = {
    adminSignupApprove: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, AdminSignUpApprove, id);
    },
};

export { adminActions };
