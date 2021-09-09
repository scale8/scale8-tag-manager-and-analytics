import { FC } from 'react';
import { FormValidationResult } from '../../hooks/form/useFormValidation';
import { useMutation, useQuery } from '@apollo/client';
import UpdateOrgGetQuery from '../../gql/queries/UpdateOrgGetQuery';
import { UpdateOrgGetData } from '../../gql/generated/UpdateOrgGetData';
import UpdateOrgQuery from '../../gql/mutations/UpdateOrgQuery';
import OrgForm from '../../components/organisms/Forms/OrgForm';
import nameValidator from '../../utils/validators/nameValidator';
import { OrgFormProps, OrgValues } from './OrgCreate';
import { ApolloError } from '@apollo/client/errors';
import { UpdateOrg } from '../../gql/generated/UpdateOrg';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';

const OrgUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const orgUpdateProps: DialogPreloadFormProps<
        UpdateOrgGetData,
        OrgValues,
        OrgFormProps,
        UpdateOrg
    > = {
        loadQuery: useQuery<UpdateOrgGetData>(UpdateOrgGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: UpdateOrgGetData) => ({
            name: formLoadedData.getOrg.name,
        }),
        saveQuery: useMutation(UpdateOrgQuery),
        mapSaveData: (formValues: OrgValues) => ({
            orgUpdateInput: {
                id: props.id,
                name: formValues.name,
            },
        }),
        buildFormProps: (
            formLoadedData: UpdateOrgGetData,
            formValidationValues: FormValidationResult<OrgValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Update Organization',
            title: 'Update Organization',
            formInfoProps: buildStandardFormInfo('organizations', 'Update'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateOrg,
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

    return (
        <DialogPreloadForm<UpdateOrgGetData, OrgValues, OrgFormProps, UpdateOrg>
            {...orgUpdateProps}
        />
    );
};

export { OrgUpdate };
