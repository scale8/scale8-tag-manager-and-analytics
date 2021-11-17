import { FC } from 'react';
import { ApolloError, useMutation } from '@apollo/client';
import {
    permissionsCustomValueSetter,
    permissionsInitialState,
    PermissionsValues,
} from '../../utils/PermissionsUtils';
import { FormProps, FormValidationResult } from '../../hooks/form/useFormValidation';
import emailValidator from '../../utils/validators/emailValidator';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import { DialogPageProps } from '../../types/DialogTypes';
import OrgAddUserQuery from '../../gql/mutations/OrgAddUserQuery';
import { AddOrgUserResult } from '../../gql/generated/AddOrgUserResult';
import OrgUserAddForm from '../../components/organisms/Forms/OrgUserAddForm';
import { DialogForm, DialogFormProps } from '../abstractions/DialogForm';

export type OrgUserAddValues = PermissionsValues & {
    firstName: string;
    lastName: string;
    email: string;
};

export type OrgUserAddFormProps = FormProps<OrgUserAddValues>;

const OrgUserAdd: FC<DialogPageProps> = (props: DialogPageProps) => {
    const orgId = props.contextId;

    const orgUserAddProps: DialogFormProps<
        OrgUserAddValues,
        OrgUserAddFormProps,
        AddOrgUserResult
    > = {
        buildInitialState: () => ({
            firstName: '',
            lastName: '',
            email: '',
            ...permissionsInitialState,
        }),
        saveQuery: useMutation<AddOrgUserResult>(OrgAddUserQuery),
        mapSaveData: (orgUserAddValues: OrgUserAddValues) => ({
            orgAddUserInput: {
                org_id: orgId,
                email: orgUserAddValues.email,
                first_name: orgUserAddValues.firstName,
                last_name: orgUserAddValues.lastName,
                org_permission_group: {
                    can_view: orgUserAddValues.permissionsCanView,
                    can_create: orgUserAddValues.permissionsCanCreate,
                    can_edit: orgUserAddValues.permissionsCanEdit,
                    can_delete: orgUserAddValues.permissionsCanDelete,
                    is_admin: orgUserAddValues.permissionsIsAdmin,
                },
            },
        }),
        buildFormProps: (
            formValidationValues: FormValidationResult<OrgUserAddValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Add User',
            title: 'Add User',
            formInfoProps: buildStandardFormInfo('organizationUsers', 'Add'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => !!formMutationData?.addUser.id,
        getSavedId: (formMutationData) => formMutationData?.addUser.id,
        pageComponent: OrgUserAddForm,
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
        <DialogForm<OrgUserAddValues, OrgUserAddFormProps, AddOrgUserResult> {...orgUserAddProps} />
    );
};

export default OrgUserAdd;
