import { FC } from 'react';
import { ApolloError, useMutation } from '@apollo/client';
import OrgInviteUserQuery from '../../gql/mutations/OrgInviteUserQuery';
import OrgUserInviteForm from '../../components/organisms/Forms/OrgUserInviteForm';
import {
    permissionsCustomValueSetter,
    permissionsInitialState,
    PermissionsValues,
} from '../../utils/PermissionsUtils';
import { FormProps, FormValidationResult } from '../../hooks/form/useFormValidation';
import emailValidator from '../../utils/validators/emailValidator';
import { InviteOrgUserResult } from '../../gql/generated/InviteOrgUserResult';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogForm, DialogFormProps } from '../abstractions/DialogForm';

export type OrgUserInviteValues = PermissionsValues & {
    email: string;
};

export type OrgUserInviteFormProps = FormProps<OrgUserInviteValues>;

const OrgUserInvite: FC<DialogPageProps> = (props: DialogPageProps) => {
    const orgId = props.contextId;

    const orgUserInviteProps: DialogFormProps<
        OrgUserInviteValues,
        OrgUserInviteFormProps,
        InviteOrgUserResult
    > = {
        buildInitialState: () => ({
            email: '',
            ...permissionsInitialState,
        }),
        saveQuery: useMutation<InviteOrgUserResult>(OrgInviteUserQuery),
        mapSaveData: (orgUserInviteValues: OrgUserInviteValues) => ({
            orgInviteUserInput: {
                org_id: orgId,
                email: orgUserInviteValues.email,
                org_permission_group: {
                    can_view: orgUserInviteValues.permissionsCanView,
                    can_create: orgUserInviteValues.permissionsCanCreate,
                    can_edit: orgUserInviteValues.permissionsCanEdit,
                    can_delete: orgUserInviteValues.permissionsCanDelete,
                    is_admin: orgUserInviteValues.permissionsIsAdmin,
                },
            },
        }),
        buildFormProps: (
            formValidationValues: FormValidationResult<OrgUserInviteValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Invite User',
            title: 'Invite User',
            formInfoProps: buildStandardFormInfo('organizationUsers', 'Invite'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => !!formMutationData?.inviteUser,
        pageComponent: OrgUserInviteForm,
        validators: [
            {
                field: 'email',
                validator: emailValidator,
                error: () => 'Invalid email address',
            },
        ],
        customValueSetter: permissionsCustomValueSetter,
        ...props,
    };

    return (
        <DialogForm<OrgUserInviteValues, OrgUserInviteFormProps, InviteOrgUserResult>
            {...orgUserInviteProps}
        />
    );
};

export { OrgUserInvite };
