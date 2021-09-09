import {
    launchHidden,
    openDrawer,
    openDrawerContextOnly,
    openLightboxWithName,
} from '../utils/PageActionUtils';
import { PageActionProps } from './PageActions';
import { OrgUserInvite } from '../dialogPages/global/OrgUserInvite';
import { OrgUserAdd } from '../dialogPages/global/OrgUserAdd';
import { RegenerateOrgUserPassword } from '../dialogPages/global/RegenerateOrgUserPassword';
import { OrgUserCancelInvitation } from '../dialogPages/global/OrgUserCancelInvitation';
import { OrgUserUpdate } from '../dialogPages/global/OrgUserUpdate';
import { OrgUserDelete } from '../dialogPages/global/OrgUserDelete';
import { OrgMeDelete } from '../dialogPages/global/OrgMeDelete';

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
