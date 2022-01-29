import { FC } from 'react';
import { FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import UpdateActionGroupGetQuery from '../../../../gql/queries/UpdateActionGroupGetQuery';
import { UpdateActionGroupGetData } from '../../../../gql/generated/UpdateActionGroupGetData';
import UpdateActionGroupQuery from '../../../../gql/mutations/UpdateActionGroupQuery';
import ActionGroupForm from '../../../../components/organisms/Forms/ActionGroupForm';
import nameValidator from '../../../../utils/validators/nameValidator';
import { ActionGroupFormProps, ActionGroupValues } from './ActionGroupCreate';
import { UpdateActionGroup } from '../../../../gql/generated/UpdateActionGroup';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';

const ActionGroupUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const actionGroupUpdateProps: DialogPreloadFormProps<
        UpdateActionGroupGetData,
        ActionGroupValues,
        ActionGroupFormProps,
        UpdateActionGroup
    > = {
        loadQuery: useQuery<UpdateActionGroupGetData>(UpdateActionGroupGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: UpdateActionGroupGetData) => ({
            name: formLoadedData.getActionGroup.name,
            comments: '',
        }),
        saveQuery: useMutation(UpdateActionGroupQuery),
        mapSaveData: (actionGroupValues: ActionGroupValues) => ({
            actionGroupUpdateInput: {
                action_group_id: props.id,
                name: actionGroupValues.name,
                ...(actionGroupValues.comments === ''
                    ? {}
                    : {
                          comments: actionGroupValues.comments,
                      }),
            },
        }),
        buildFormProps: (
            formLoadedData: UpdateActionGroupGetData,
            formValidationValues: FormValidationResult<ActionGroupValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Update Action Group',
            title: 'Update Action Group',
            formInfoProps: buildStandardFormInfo('actionGroups', 'Update'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateActionGroup,
        pageComponent: ActionGroupForm,
        validators: [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Action Group name too short',
            },
        ],
        ...props,
    };

    return (
        <DialogPreloadForm<
            UpdateActionGroupGetData,
            ActionGroupValues,
            ActionGroupFormProps,
            UpdateActionGroup
        >
            {...actionGroupUpdateProps}
        />
    );
};

export default ActionGroupUpdate;
