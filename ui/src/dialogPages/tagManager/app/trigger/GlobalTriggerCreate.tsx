import { FC } from 'react';
import {
    FormMutationData,
    FormProps,
    FormValidationResult,
} from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation } from '@apollo/client';
import { TagType } from '../../../../gql/generated/globalTypes';
import nameValidator from '../../../../utils/validators/nameValidator';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { CreateGlobalTriggerResult } from '../../../../gql/generated/CreateGlobalTriggerResult';
import CreateGlobalTriggerQuery from '../../../../gql/mutations/CreateGlobalTriggerQuery';
import GlobalTriggerForm from '../../../../components/organisms/Forms/GlobalTriggerForm';
import { DialogForm, DialogFormProps } from '../../../abstractions/DialogForm';

export type TriggerValues = {
    name: string;
    comments: string;
};

export type TriggerFormProps = FormProps<TriggerValues>;

const GlobalTriggerCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const revisionId = props.contextId;

    const tagCreateProps: DialogFormProps<
        TriggerValues,
        TriggerFormProps,
        CreateGlobalTriggerResult
    > = {
        buildInitialState: () => ({
            name: '',
            comments: '',
            type: TagType.HEAD,
            width: null,
            height: null,
        }),
        saveQuery: useMutation(CreateGlobalTriggerQuery),
        mapSaveData: (triggerValues: TriggerValues) => ({
            triggerCreateInput: {
                revision_id: revisionId,
                name: triggerValues.name,
                ...(triggerValues.comments === ''
                    ? {}
                    : {
                          comments: triggerValues.comments,
                      }),
            },
        }),
        buildFormProps: (
            formValidationValues: FormValidationResult<TriggerValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Trigger',
            title: 'Create Trigger',
            formInfoProps: buildStandardFormInfo('globalTriggers', 'Create'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (
            formMutationData: FormMutationData | CreateGlobalTriggerResult,
        ) => formMutationData?.createTrigger.id !== undefined,
        getSavedId: (formMutationData: FormMutationData | CreateGlobalTriggerResult) =>
            formMutationData?.createTrigger.id,
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
        <DialogForm<TriggerValues, TriggerFormProps, CreateGlobalTriggerResult>
            {...tagCreateProps}
        />
    );
};

export default GlobalTriggerCreate;
