import { FC, useCallback, useEffect } from 'react';
import ActionGroupDistributionForm from '../../../../components/organisms/Forms/ActionGroupDistributionForm';
import { useFormValidation } from '../../../../hooks/form/useFormValidation';
import { useMutation } from '@apollo/client';
import CreateActionGroupDistributionQuery from '../../../../gql/mutations/CreateActionGroupDistributionQuery';
import {
    ActionGroupCreateInput,
    ActionGroupDistributionCreateInput,
    ActionGroupDistributionType,
} from '../../../../gql/generated/globalTypes';
import CreateActionGroupQuery from '../../../../gql/mutations/CreateActionGroupQuery';
import nameValidator from '../../../../utils/validators/nameValidator';
import { usePageDialogControls } from '../../../../hooks/dialog/usePageDialogControls';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import {
    ActionGroupDistributionCreateProps,
    ActionGroupDistributionFormProps,
    ActionGroupDistributionValues,
} from '../../../../types/props/forms/ActionGroupDistributionFormProps';
import { logError } from '../../../../utils/logUtils';

const ActionGroupDistributionCreate: FC<ActionGroupDistributionCreateProps> = (
    props: ActionGroupDistributionCreateProps,
) => {
    const submitText: string =
        props.submitText === undefined ? 'Create Action Group Distribution' : props.submitText;

    const [
        createActionGroupDistribution,
        { loading: loadingActionGroupDistribution, data, error: gqlErrorActionGroupDistribution },
    ] = useMutation(CreateActionGroupDistributionQuery);

    const [
        createActionGroup,
        { loading: loadingActionGroup, data: dataActionGroup, error: gqlErrorActionGroup },
    ] = useMutation(CreateActionGroupQuery);

    const formInitialState = {
        name: '',
        type: ActionGroupDistributionType.NONE,
        comments: '',
    };

    const submitForm = async (actionGroupDistributionValues: ActionGroupDistributionValues) => {
        const actionGroupDistributionCreateInput: ActionGroupDistributionCreateInput = {
            ...(props.contextId === '' ? { revision_id: props.id } : { rule_id: props.id }),
            name: actionGroupDistributionValues.name,
            action_group_distribution_type:
                actionGroupDistributionValues.type ?? ActionGroupDistributionType.NONE,
            ...(actionGroupDistributionValues.comments === ''
                ? {}
                : {
                      comments: actionGroupDistributionValues.comments,
                  }),
        };
        try {
            await createActionGroupDistribution({
                variables: { actionGroupDistributionCreateInput },
            });
        } catch (error) {
            logError(error);
        }
    };

    const createActionGroupCallback = useCallback(createActionGroup, []);

    useEffect(() => {
        if (
            data?.createActionGroupDistribution.id !== undefined &&
            data?.createActionGroupDistribution.name !== undefined &&
            data?.createActionGroupDistribution.action_group_distribution_type ===
                ActionGroupDistributionType.NONE
        ) {
            (async () => {
                const actionGroupCreateInput: ActionGroupCreateInput = {
                    action_group_distribution_id: data.createActionGroupDistribution.id,
                    name: data.createActionGroupDistribution.name,
                };
                try {
                    await createActionGroupCallback({
                        variables: { actionGroupCreateInput },
                    });
                } catch (error) {
                    logError(error);
                }
            })();
        }
    }, [data, createActionGroupCallback]);

    const formValidationValues = useFormValidation<ActionGroupDistributionValues>(
        formInitialState,
        [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Rule Group name too short',
            },
        ],
        submitForm,
    );

    const successfullySubmitted =
        data?.createActionGroupDistribution.id !== undefined &&
        (data?.createActionGroupDistribution.action_group_distribution_type !==
            ActionGroupDistributionType.NONE || dataActionGroup?.createActionGroup.id) !==
            undefined;

    usePageDialogControls(
        JSON.stringify(formInitialState) === JSON.stringify(formValidationValues.values),
        successfullySubmitted,
        props.setPageHasChanges,
        props.handleDialogClose,
        props.pageRefresh,
    );

    if (loadingActionGroup || loadingActionGroupDistribution || successfullySubmitted) {
        return <div />;
    }

    const gqlError = gqlErrorActionGroupDistribution
        ? gqlErrorActionGroupDistribution
        : gqlErrorActionGroup;

    const formProps: ActionGroupDistributionFormProps = {
        ...formValidationValues,
        gqlError,
        submitText,
        title: 'Create Action Group Distribution',
        formInfoProps: buildStandardFormInfo('actionGroupDistributions', 'Create'),
        handleDialogClose: props.handleDialogClose,
        noTitle: props.noTitle,
    };

    return <ActionGroupDistributionForm {...formProps} />;
};

export default ActionGroupDistributionCreate;
