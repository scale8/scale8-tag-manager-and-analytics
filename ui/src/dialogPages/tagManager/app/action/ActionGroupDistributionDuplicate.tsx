import { FC } from 'react';
import { FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import DuplicateActionGroupDistributionQuery from '../../../../gql/mutations/DuplicateActionGroupDistributionQuery';
import DuplicateDialogForm, {
    DuplicateDialogProps,
} from '../../../../components/organisms/Forms/DuplicateDialogForm';
import DuplicateActionGroupDistributionGetQuery from '../../../../gql/queries/DuplicateActionGroupDistributionGetQuery';
import { DuplicateActionGroupDistributionGetData } from '../../../../gql/generated/DuplicateActionGroupDistributionGetData';
import { DuplicateActionGroupDistribution } from '../../../../gql/generated/DuplicateActionGroupDistribution';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import {
    DuplicateValidators,
    DuplicateValues,
} from '../../../../utils/forms/DuplicateDialogFormUtils';

const ActionGroupDistributionDuplicate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const duplicateProps: DialogPreloadFormProps<
        DuplicateActionGroupDistributionGetData,
        DuplicateValues,
        DuplicateDialogProps,
        DuplicateActionGroupDistribution
    > = {
        loadQuery: useQuery<DuplicateActionGroupDistributionGetData>(
            DuplicateActionGroupDistributionGetQuery,
            {
                variables: { id: props.id },
            },
        ),
        buildInitialStatePreload: (formLoadedData: DuplicateActionGroupDistributionGetData) => ({
            name: `${formLoadedData.getActionGroupDistribution.name} Copy`,
        }),
        saveQuery: useMutation<DuplicateActionGroupDistribution>(
            DuplicateActionGroupDistributionQuery,
        ),
        mapSaveData: (formValues: DuplicateValues) => ({
            actionGroupDistributionDuplicateInput: {
                name: formValues.name,
                action_group_distribution_id: props.id,
            },
        }),
        buildFormProps: (
            formLoadedData: DuplicateActionGroupDistributionGetData,
            formValidationValues: FormValidationResult<DuplicateValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Action Group Distribution',
            title: 'Create Action Group Distribution',
            oldName: formLoadedData.getActionGroupDistribution.name,
            description: `Create a new Action Group Distribution from ${formLoadedData.getActionGroupDistribution.name}?`,
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.duplicateActionGroupDistribution.id !== undefined,
        pageComponent: DuplicateDialogForm,
        validators: DuplicateValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<
            DuplicateActionGroupDistributionGetData,
            DuplicateValues,
            DuplicateDialogProps,
            DuplicateActionGroupDistribution
        >
            {...duplicateProps}
        />
    );
};

export default ActionGroupDistributionDuplicate;
