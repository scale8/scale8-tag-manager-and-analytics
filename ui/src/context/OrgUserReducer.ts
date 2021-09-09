export type CurrentOrgPermissions = {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    isAdmin: boolean;
};

export type GqlOrgPermissions = {
    can_view: boolean;
    can_create: boolean;
    can_edit: boolean;
    can_delete: boolean;
    is_admin: boolean;
};

export type GqlOrgUserAccount = {
    id: string;
    trial_expires_in: number;
    is_trial: boolean;
};

export type OrgUserAccount = {
    id: string;
    trialExpiration: number;
    isTrial: boolean;
} | null;

export type GqlOrgUserState = {
    id: string;
    name: string;
    tag_manager_account: GqlOrgUserAccount | null;
    data_manager_account: GqlOrgUserAccount | null;
    me: {
        id: string;
        owner: boolean;
        permissions: GqlOrgPermissions;
        can_create_tag_manager_trial: boolean;
        can_create_data_manager_trial: boolean;
    };
};

export type OrgUserState = {
    orgId: string;
    orgName: string;
    currentOrgPermissions: CurrentOrgPermissions;
    isOwner: boolean;
    dataManagerAccount: OrgUserAccount;
    tagManagerAccount: OrgUserAccount;
    canCreateTagManagerTrial: boolean;
    canCreateDataManagerTrial: boolean;
};

export type OrgUserAction = {
    type: 'noCurrentOrg' | 'setOrgUserState';
    payload?: OrgUserState;
};

export const OrgUserAccountFromGql = (gqlOrgUserAccount: GqlOrgUserAccount): OrgUserAccount => {
    return {
        id: gqlOrgUserAccount.id,
        trialExpiration: gqlOrgUserAccount.trial_expires_in,
        isTrial: gqlOrgUserAccount.is_trial,
    };
};

export const OrgUserStateFromGql = (orgUserDetails: GqlOrgUserState): OrgUserState => {
    return {
        orgId: orgUserDetails.id,
        orgName: orgUserDetails.name,
        currentOrgPermissions: {
            canView: orgUserDetails.me.permissions.can_view,
            canCreate: orgUserDetails.me.permissions.can_create,
            canEdit: orgUserDetails.me.permissions.can_edit,
            canDelete: orgUserDetails.me.permissions.can_delete,
            isAdmin: orgUserDetails.me.permissions.is_admin,
        },
        isOwner: orgUserDetails.me.owner,
        canCreateTagManagerTrial: orgUserDetails.me.can_create_tag_manager_trial,
        canCreateDataManagerTrial: orgUserDetails.me.can_create_data_manager_trial,
        dataManagerAccount:
            orgUserDetails.data_manager_account === null
                ? null
                : OrgUserAccountFromGql(orgUserDetails.data_manager_account),
        tagManagerAccount:
            orgUserDetails.tag_manager_account === null
                ? null
                : OrgUserAccountFromGql(orgUserDetails.tag_manager_account),
    };
};

export const extractPermissionsFromOrgUser = (
    orgUserState: OrgUserState | null,
): CurrentOrgPermissions =>
    orgUserState?.currentOrgPermissions ?? {
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        isAdmin: false,
    };

export const orgUserReducer = (
    state: OrgUserState | null,
    action: OrgUserAction,
): OrgUserState | null => {
    switch (action.type) {
        case 'setOrgUserState':
            if (action.payload === undefined) {
                throw new Error('Reducer Error');
            }

            return action.payload;
        case 'noCurrentOrg':
            return null;
        default:
            throw new Error('Reducer Error');
    }
};
