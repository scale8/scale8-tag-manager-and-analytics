import { FC } from 'react';
import { FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import DuplicateActionGroupQuery from '../../../../gql/mutations/DuplicateActionGroupQuery';
import DuplicateDialogForm, {
    DuplicateDialogProps,
} from '../../../../components/organisms/Forms/DuplicateDialogForm';
import DuplicateActionGroupGetQuery from '../../../../gql/queries/DuplicateActionGroupGetQuery';
import { DuplicateActionGroupGetData } from '../../../../gql/generated/DuplicateActionGroupGetData';
import { DuplicateActionGroup } from '../../../../gql/generated/DuplicateActionGroup';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import {
    DuplicateValidators,
    DuplicateValues,
} from '../../../../utils/forms/DuplicateDialogFormUtils';
import { generateRevisionName } from '../../../../../../common/utils/GenerateRevisionName';

const ActionGroupDuplicate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const duplicateProps: DialogPreloadFormProps<
        DuplicateActionGroupGetData,
        DuplicateValues,
        DuplicateDialogProps,
        DuplicateActionGroup
    > = {
        loadQuery: useQuery<DuplicateActionGroupGetData>(DuplicateActionGroupGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: () => ({
            name: generateRevisionName(),
        }),
        saveQuery: useMutation<DuplicateActionGroup>(DuplicateActionGroupQuery),
        mapSaveData: (formValues: DuplicateValues) => ({
            actionGroupDuplicateInput: {
                name: formValues.name,
                action_group_id: props.id,
            },
        }),
        buildFormProps: (
            formLoadedData: DuplicateActionGroupGetData,
            formValidationValues: FormValidationResult<DuplicateValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Action Group',
            title: 'Create Action Group',
            oldName: formLoadedData.getActionGroup.name,
            description: `Create a new Action Group from ${formLoadedData.getActionGroup.name}?`,
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.duplicateActionGroup.id !== undefined,
        pageComponent: DuplicateDialogForm,
        validators: DuplicateValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<
            DuplicateActionGroupGetData,
            DuplicateValues,
            DuplicateDialogProps,
            DuplicateActionGroup
        >
            {...duplicateProps}
        />
    );
};

export default ActionGroupDuplicate;
