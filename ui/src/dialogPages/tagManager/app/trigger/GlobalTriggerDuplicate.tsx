import { FC } from 'react';
import { FormMutationData, FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import DuplicateDialogForm, {
    DuplicateDialogProps,
} from '../../../../components/organisms/Forms/DuplicateDialogForm';
import { DuplicateGlobalTriggerGetData } from '../../../../gql/generated/DuplicateGlobalTriggerGetData';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import DuplicateGlobalTriggerGetQuery from '../../../../gql/queries/DuplicateGlobalTriggerGetQuery';
import DuplicateGlobalTriggerQuery from '../../../../gql/mutations/DuplicateGlobalTriggerQuery';
import { DuplicateGlobalTrigger } from '../../../../gql/generated/DuplicateGlobalTrigger';
import {
    DuplicateValidators,
    DuplicateValues,
} from '../../../../utils/forms/DuplicateDialogFormUtils';

const GlobalTriggerDuplicate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const duplicateProps: DialogPreloadFormProps<
        DuplicateGlobalTriggerGetData,
        DuplicateValues,
        DuplicateDialogProps,
        DuplicateGlobalTrigger
    > = {
        loadQuery: useQuery<DuplicateGlobalTriggerGetData>(DuplicateGlobalTriggerGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: DuplicateGlobalTriggerGetData) => ({
            name: `${formLoadedData.getTrigger.name} Copy`,
        }),
        saveQuery: useMutation<DuplicateGlobalTrigger>(DuplicateGlobalTriggerQuery),
        mapSaveData: (formValues: DuplicateValues) => ({
            triggerDuplicateInput: {
                name: formValues.name,
                trigger_id: props.id,
            },
        }),
        buildFormProps: (
            formLoadedData: DuplicateGlobalTriggerGetData,
            formValidationValues: FormValidationResult<DuplicateValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Trigger',
            title: 'Create Trigger',
            handleDialogClose: props.handleDialogClose,
            oldName: formLoadedData.getTrigger.name,
            description: `Create a new Trigger from ${formLoadedData.getTrigger.name}?`,
        }),
        checkSuccessfullySubmitted: (formMutationData: FormMutationData | DuplicateGlobalTrigger) =>
            formMutationData?.duplicateTrigger.id !== undefined,
        pageComponent: DuplicateDialogForm,
        validators: DuplicateValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<
            DuplicateGlobalTriggerGetData,
            DuplicateValues,
            DuplicateDialogProps,
            DuplicateGlobalTrigger
        >
            {...duplicateProps}
        />
    );
};

export { GlobalTriggerDuplicate };
