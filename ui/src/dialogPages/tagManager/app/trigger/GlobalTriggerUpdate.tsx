import { FC } from 'react';
import { FormMutationData, FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import nameValidator from '../../../../utils/validators/nameValidator';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { TriggerFormProps, TriggerValues } from './GlobalTriggerCreate';
import GlobalTriggerForm from '../../../../components/organisms/Forms/GlobalTriggerForm';
import UpdateGlobalTriggerGetQuery from '../../../../gql/queries/UpdateGlobalTriggerGetQuery';
import { UpdateGlobalTriggerGetData } from '../../../../gql/generated/UpdateGlobalTriggerGetData';
import { UpdateGlobalTriggerResult } from '../../../../gql/generated/UpdateGlobalTriggerResult';
import UpdateGlobalTriggerQuery from '../../../../gql/mutations/UpdateGlobalTriggerQuery';

const GlobalTriggerUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const tagUpdateProps: DialogPreloadFormProps<
        UpdateGlobalTriggerGetData,
        TriggerValues,
        TriggerFormProps,
        UpdateGlobalTriggerResult
    > = {
        loadQuery: useQuery<UpdateGlobalTriggerGetData>(UpdateGlobalTriggerGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: UpdateGlobalTriggerGetData) => ({
            name: formLoadedData.getTrigger.name,
            comments: '',
        }),
        saveQuery: useMutation(UpdateGlobalTriggerQuery),
        mapSaveData: (triggerValues: TriggerValues) => ({
            triggerUpdateInput: {
                trigger_id: props.id,
                name: triggerValues.name,
                ...(triggerValues.comments === ''
                    ? {}
                    : {
                          comments: triggerValues.comments,
                      }),
            },
        }),
        buildFormProps: (
            formLoadedData: UpdateGlobalTriggerGetData,
            formValidationValues: FormValidationResult<TriggerValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Update Trigger',
            title: 'Update Trigger',
            formInfoProps: buildStandardFormInfo('globalTriggers', 'Update'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (
            formMutationData: FormMutationData | UpdateGlobalTriggerResult,
        ) => formMutationData?.updateTrigger,
        pageComponent: GlobalTriggerForm,
        validators: [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Trigger name too short',
            },
        ],
        ...props,
    };

    return (
        <DialogPreloadForm<
            UpdateGlobalTriggerGetData,
            TriggerValues,
            TriggerFormProps,
            UpdateGlobalTriggerResult
        >
            {...tagUpdateProps}
        />
    );
};

export { GlobalTriggerUpdate };
