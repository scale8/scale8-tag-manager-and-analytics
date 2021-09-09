import { PageActionProps } from './PageActions';
import { launchHidden, openDrawer, openLightbox } from '../utils/PageActionUtils';
import { OrgCreate } from '../dialogPages/global/OrgCreate';
import { OrgUpdate } from '../dialogPages/global/OrgUpdate';
import { OrgDelete } from '../dialogPages/global/OrgDelete';
import { TagManagerStartTrial } from '../dialogPages/global/TagManagerStartTrial';
import { DataManagerStartTrial } from '../dialogPages/global/DataManagerStartTrial';
import { AccountProduct } from '../gql/generated/globalTypes';
import { TagManagerAccountSubscribe } from '../dialogPages/global/TagManagerAccountSubscribe';
import { DataManagerAccountSubscribe } from '../dialogPages/global/DataManagerAccountSubscribe';
import { TagManagerAccountUnsubscribe } from '../dialogPages/global/TagManagerAccountUnsubscribe';
import { DataManagerAccountUnsubscribe } from '../dialogPages/global/DataManagerAccountUnsubscribe';
import { OpenOrgBillingPage } from '../dialogPages/global/OpenOrgBillingPage';
import { OrgTransferOwnership } from '../dialogPages/global/OrgTransferOwnership';

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
