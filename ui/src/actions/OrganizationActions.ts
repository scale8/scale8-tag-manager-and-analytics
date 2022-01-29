import { PageActionProps } from './PageActions';
import { launchHidden, openDrawer, openLightbox } from '../utils/PageActionUtils';
import { AccountProduct } from '../gql/generated/globalTypes';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const OrgCreate = dynamic(() => import('../dialogPages/global/OrgCreate')) as FC<DialogPageProps>;

const OrgUpdate = dynamic(() => import('../dialogPages/global/OrgUpdate')) as FC<DialogPageProps>;

const OrgDelete = dynamic(() => import('../dialogPages/global/OrgDelete')) as FC<DialogPageProps>;

const TagManagerStartTrial = dynamic(
    () => import('../dialogPages/global/TagManagerStartTrial'),
) as FC<DialogPageProps>;

const DataManagerStartTrial = dynamic(
    () => import('../dialogPages/global/DataManagerStartTrial'),
) as FC<DialogPageProps>;

const TagManagerAccountSubscribe = dynamic(
    () => import('../dialogPages/global/TagManagerAccountSubscribe'),
) as FC<DialogPageProps>;

const DataManagerAccountSubscribe = dynamic(
    () => import('../dialogPages/global/DataManagerAccountSubscribe'),
) as FC<DialogPageProps>;

const TagManagerAccountUnsubscribe = dynamic(
    () => import('../dialogPages/global/TagManagerAccountUnsubscribe'),
) as FC<DialogPageProps>;

const DataManagerAccountUnsubscribe = dynamic(
    () => import('../dialogPages/global/DataManagerAccountUnsubscribe'),
) as FC<DialogPageProps>;

const OpenOrgBillingPage = dynamic(
    () => import('../dialogPages/global/OpenOrgBillingPage'),
) as FC<DialogPageProps>;

const OrgTransferOwnership = dynamic(
    () => import('../dialogPages/global/OrgTransferOwnership'),
) as FC<DialogPageProps>;

const organizationActions = {
    createOrganization: (pageActionProps: PageActionProps): void => {
        openDrawer(pageActionProps, OrgCreate);
    },
    updateOrganization: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, OrgUpdate, id);
    },
    deleteOrganization: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, OrgDelete, id);
    },
    startTagManagerTrial: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, TagManagerStartTrial, id);
    },
    startDataManagerTrial: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, DataManagerStartTrial, id);
    },
    accountSubscribe: (
        pageActionProps: PageActionProps,
        orgId: string,
        productId: string,
        accountProduct: AccountProduct,
        overrideRefresh?: () => void,
    ): void => {
        if (accountProduct === AccountProduct.TAG_MANAGER) {
            launchHidden(
                pageActionProps,
                TagManagerAccountSubscribe,
                productId,
                undefined,
                orgId,
                true,
                true,
                overrideRefresh,
            );
        }
        if (accountProduct === AccountProduct.DATA_MANAGER) {
            launchHidden(
                pageActionProps,
                DataManagerAccountSubscribe,
                productId,
                undefined,
                orgId,
                true,
                true,
                overrideRefresh,
            );
        }
    },
    accountUnsubscribe: (
        pageActionProps: PageActionProps,
        orgId: string,
        accountProduct: AccountProduct,
    ): void => {
        if (accountProduct === AccountProduct.TAG_MANAGER) {
            launchHidden(pageActionProps, TagManagerAccountUnsubscribe, orgId);
        }
        if (accountProduct === AccountProduct.DATA_MANAGER) {
            launchHidden(pageActionProps, DataManagerAccountUnsubscribe, orgId);
        }
    },
    openBillingPage(pageActionProps: PageActionProps, orgId: string): void {
        launchHidden(pageActionProps, OpenOrgBillingPage, orgId);
    },
    transferOwnership: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, OrgTransferOwnership, id, true, true);
    },
};

export { organizationActions };
