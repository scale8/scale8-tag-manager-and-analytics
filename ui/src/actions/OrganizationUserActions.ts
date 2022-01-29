import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openDrawerContextOnly,
    openLightboxWithName,
} from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const OrgUserInvite = dynamic(
    () => import('../dialogPages/global/OrgUserInvite'),
) as FC<DialogPageProps>;

const OrgUserAdd = dynamic(() => import('../dialogPages/global/OrgUserAdd')) as FC<DialogPageProps>;

const RegenerateOrgUserPassword = dynamic(
    () => import('../dialogPages/global/RegenerateOrgUserPassword'),
) as FC<DialogPageProps>;

const OrgUserCancelInvitation = dynamic(
    () => import('../dialogPages/global/OrgUserCancelInvitation'),
) as FC<DialogPageProps>;

const OrgUserUpdate = dynamic(
    () => import('../dialogPages/global/OrgUserUpdate'),
) as FC<DialogPageProps>;

const OrgUserDelete = dynamic(
    () => import('../dialogPages/global/OrgUserDelete'),
) as FC<DialogPageProps>;

const OrgMeDelete = dynamic(
    () => import('../dialogPages/global/OrgMeDelete'),
) as FC<DialogPageProps>;

const organizationUserActions = {
    inviteUser: (pageActionProps: PageActionProps, orgId: string): void => {
        openDrawerContextOnly(pageActionProps, OrgUserInvite, orgId);
    },
    addUser: (
        pageActionProps: PageActionProps,
        orgId: string,
        followUp: (
            id: string,
            pageRefresh: () => void,
            handleDialogClose: (checkChanges: boolean) => void,
        ) => void,
    ): void => {
        openDrawerContextOnly(pageActionProps, OrgUserAdd, orgId, true, false, undefined, followUp);
    },
    regenerateUserPassword: (
        pageActionProps: PageActionProps,
        id: string,
        orgId: string,
        name: string,
    ): void => {
        openLightboxWithName(
            pageActionProps,
            RegenerateOrgUserPassword,
            id,
            name,
            true,
            true,
            orgId,
        );
    },
    cancelInvitation: (pageActionProps: PageActionProps, id: string, orgId: string): void => {
        launchHidden(pageActionProps, OrgUserCancelInvitation, id, undefined, orgId);
    },
    updateUserPermissions: (pageActionProps: PageActionProps, id: string, orgId: string): void => {
        openDrawer(pageActionProps, OrgUserUpdate, id, true, false, orgId);
    },
    removeUser: (pageActionProps: PageActionProps, id: string, orgId: string): void => {
        launchHidden(pageActionProps, OrgUserDelete, id, undefined, orgId);
    },
    removeMe: (pageActionProps: PageActionProps, orgId: string): void => {
        launchHidden(pageActionProps, OrgMeDelete, orgId);
    },
};

export { organizationUserActions };
