import { PageActionProps } from './PageActions';
import { launchHidden } from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const AdminSignUpApprove = dynamic(
    () => import('../dialogPages/global/AdminSignUpApprove'),
) as FC<DialogPageProps>;

const adminActions = {
    adminSignupApprove: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, AdminSignUpApprove, id);
    },
};

export { adminActions };
