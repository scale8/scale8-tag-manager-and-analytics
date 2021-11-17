import { FC } from 'react';
import OrgForm from '../../components/organisms/Forms/OrgForm';
import { FormProps, FormValidationResult } from '../../hooks/form/useFormValidation';
import { useMutation } from '@apollo/client';
import CreateOrgQuery from '../../gql/mutations/CreateOrgQuery';
import nameValidator from '../../utils/validators/nameValidator';
import { ApolloError } from '@apollo/client/errors';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import { DialogPageProps } from '../../types/DialogTypes';
import { CreateOrg } from '../../gql/generated/CreateOrg';
import { DialogForm, DialogFormProps } from '../abstractions/DialogForm';

export type OrgValues = {
    name: string;
};

export type OrgFormProps = FormProps<OrgValues>;

const OrgCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const orgCreateProps: DialogFormProps<OrgValues, OrgFormProps, CreateOrg> = {
        buildInitialState: () => ({
            name: '',
        }),
        saveQuery: useMutation(CreateOrgQuery),
        mapSaveData: (formValues: OrgValues) => ({
            orgCreateInput: {
                name: formValues.name,
            },
        }),
        buildFormProps: (
            formValidationValues: FormValidationResult<OrgValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Organization',
            title: 'Create Organization',
            formInfoProps: buildStandardFormInfo('organizations', 'Create'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.createOrg.id !== undefined,
        pageComponent: OrgForm,
        validators: [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Organization name too short',
            },
        ],
        ...props,
    };

    return <DialogForm<OrgValues, OrgFormProps, CreateOrg> {...orgCreateProps} />;
};

export default OrgCreate;
