import { FC } from 'react';
import { useFormValidation } from '../../../../hooks/form/useFormValidation';
import { useMutation, useQuery } from '@apollo/client';
import UpdateActionGroupDistributionGetQuery from '../../../../gql/queries/UpdateActionGroupDistributionGetQuery';
import { UpdateActionGroupDistributionGetData } from '../../../../gql/generated/UpdateActionGroupDistributionGetData';
import UpdateActionGroupDistributionQuery from '../../../../gql/mutations/UpdateActionGroupDistributionQuery';
import ActionGroupDistributionForm from '../../../../components/organisms/Forms/ActionGroupDistributionForm';
import { ActionGroupDistributionUpdateInput } from '../../../../gql/generated/globalTypes';
import nameValidator from '../../../../utils/validators/nameValidator';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { usePageDialogControls } from '../../../../hooks/dialog/usePageDialogControls';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { queryLoaderAndError } from '../../../../abstractions/QueryLoaderAndError';
import {
    ActionGroupDistributionFormProps,
    ActionGroupDistributionValues,
} from '../../../../types/props/forms/ActionGroupDistributionFormProps';
import { logError } from '../../../../utils/logUtils';

type ActionGroupDistributionUpdateFormAfterLoadProps = DialogPageProps & {
    initialState: {
        name: string;
        comments: string;
    };
};

const ActionGroupDistributionUpdateFormAfterLoad: FC<ActionGroupDistributionUpdateFormAfterLoadProps> =
    (props: ActionGroupDistributionUpdateFormAfterLoadProps) => {
        const [updateActionGroupDistribution, { loading, data, error: gqlError }] = useMutation(
            UpdateActionGroupDistributionQuery,
        );

        const submitForm = async (actionGroupDistributionValues: ActionGroupDistributionValues) => {
            const actionGroupDistributionUpdateInput: ActionGroupDistributionUpdateInput = {
                action_group_distribution_id: props.id,
                name: actionGroupDistributionValues.name,
                ...(actionGroupDistributionValues.comments === ''
                    ? {}
                    : {
                          comments: actionGroupDistributionValues.comments,
                      }),
            };
            try {
                await updateActionGroupDistribution({
                    variables: { actionGroupDistributionUpdateInput },
                });
            } catch (error) {
                logError(error);
            }
        };

        const formValidationValues = useFormValidation<ActionGroupDistributionValues>(
            props.initialState,
            [
                {
                    field: 'name',
                    validator: nameValidator,
                    error: () => 'Rule Group name too short',
                },
            ],
            submitForm,
        );

        const successfullySubmitted = data?.updateActionGroupDistribution;

        usePageDialogControls(
            JSON.stringify(props.initialState) === JSON.stringify(formValidationValues.values),
            successfullySubmitted,
            props.setPageHasChanges,
            props.handleDialogClose,
            props.pageRefresh,
        );

        if (loading || successfullySubmitted) {
            return <div />;
        }

        const formProps: ActionGroupDistributionFormProps = {
            ...formValidationValues,
            gqlError,
            submitText: 'Update Action Group Distribution',
            title: 'Update Action Group Distribution',
            formInfoProps: buildStandardFormInfo('actionGroupDistributions', 'Update'),
            handleDialogClose: props.handleDialogClose,
        };

        return <ActionGroupDistributionForm {...formProps} isUpdate={true} />;
    };

const ActionGroupDistributionUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    return queryLoaderAndError<UpdateActionGroupDistributionGetData>(
        false,
        useQuery<UpdateActionGroupDistributionGetData>(UpdateActionGroupDistributionGetQuery, {
            variables: { id: props.id },
        }),
        (data: UpdateActionGroupDistributionGetData) => {
            const initialState = {
                name: data.getActionGroupDistribution.name,
                comments: '',
            };

            return (
                <ActionGroupDistributionUpdateFormAfterLoad
                    initialState={initialState}
                    {...props}
                />
            );
        },
    );
};

export { ActionGroupDistributionUpdate };
