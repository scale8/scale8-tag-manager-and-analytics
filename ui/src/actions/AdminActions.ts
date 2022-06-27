import { PageActionProps } from './PageActions';
import { launchHidden } from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const AdminGoIn = dynamic(() => import('../dialogPages/global/AdminGoIn')) as FC<DialogPageProps>;
const AdminManualInvoicing = dynamic(
    () => import('../dialogPages/global/AdminManualInvoicing'),
) as FC<DialogPageProps>;

const adminActions = {
    adminGoIn: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, AdminGoIn, id);
    },
    adminManualInvoicing: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, AdminManualInvoicing, id);
    },
};

export { adminActions };
