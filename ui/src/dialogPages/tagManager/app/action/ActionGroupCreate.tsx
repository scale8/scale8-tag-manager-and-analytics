import { FC } from 'react';
import ActionGroupForm from '../../../../components/organisms/Forms/ActionGroupForm';
import { FormProps, FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation } from '@apollo/client';
import CreateActionGroupQuery from '../../../../gql/mutations/CreateActionGroupQuery';
import nameValidator from '../../../../utils/validators/nameValidator';
import { CreateActionGroup } from '../../../../gql/generated/CreateActionGroup';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { DialogForm, DialogFormProps } from '../../../abstractions/DialogForm';

export type ActionGroupValues = {
    name: string;
    comments: string;
};

export type ActionGroupFormProps = FormProps<ActionGroupValues>;

const ActionGroupCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const actionGroupCreateProps: DialogFormProps<
        ActionGroupValues,
        ActionGroupFormProps,
        CreateActionGroup
    > = {
        buildInitialState: () => ({
            name: '',
            comments: '',
        }),
        saveQuery: useMutation(CreateActionGroupQuery),
        mapSaveData: (actionGroupValues: ActionGroupValues) => ({
            actionGroupCreateInput: {
                action_group_distribution_id: props.id,
                name: actionGroupValues.name,
                ...(actionGroupValues.comments === ''
                    ? {}
                    : {
                          comments: actionGroupValues.comments,
                      }),
            },
        }),
        buildFormProps: (
            formValidationValues: FormValidationResult<ActionGroupValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Action Group',
            title: 'Create Action Group',
            formInfoProps: buildStandardFormInfo('actionGroups', 'Create'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.createActionGroup.id !== undefined,
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
        <DialogForm<ActionGroupValues, ActionGroupFormProps, CreateActionGroup>
            {...actionGroupCreateProps}
        />
    );
};

export default ActionGroupCreate;
