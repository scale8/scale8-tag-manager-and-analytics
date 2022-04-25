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
    enabled: boolean;
};

export type OrgUserAccount = {
    id: string;
    trialExpiration: number;
    isTrial: boolean;
    enabled: boolean;
};

export type GqlOrgUserState = {
    id: string;
    name: string;
    tag_manager_account: GqlOrgUserAccount;
    data_manager_account: GqlOrgUserAccount;
    me: {
        id: string;
        owner: boolean;
        permissions: GqlOrgPermissions;
    };
};

export type OrgUserState = {
    orgId: string;
    orgName: string;
    currentOrgPermissions: CurrentOrgPermissions;
    isOwner: boolean;
    dataManagerAccount: OrgUserAccount;
    tagManagerAccount: OrgUserAccount;
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
        enabled: gqlOrgUserAccount.enabled,
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
        dataManagerAccount: OrgUserAccountFromGql(orgUserDetails.data_manager_account),
        tagManagerAccount: OrgUserAccountFromGql(orgUserDetails.tag_manager_account),
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
