import { FC } from 'react';
import RuleForm from '../../../../components/organisms/Forms/RuleForm';
import { FormProps, FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import CreateRuleQuery from '../../../../gql/mutations/CreateRuleQuery';
import nameValidator from '../../../../utils/validators/nameValidator';
import { CreateRuleResult } from '../../../../gql/generated/CreateRuleResult';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import { FetchAvailableGlobalTriggers } from '../../../../gql/generated/FetchAvailableGlobalTriggers';
import FetchAvailableGlobalTriggersQuery from '../../../../gql/queries/FetchAvailableGlobalTriggersQuery';

export type RuleValues = {
    name: string;
    globalTriggerId: string;
    minRepeatInterval: number;
    comments: string;
};

export type RuleFormProps = FormProps<RuleValues> & {
    availableGlobalTriggers?: { key: string; text: string }[];
};

const RuleCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const ruleCreateProps: DialogPreloadFormProps<
        FetchAvailableGlobalTriggers,
        RuleValues,
        RuleFormProps,
        CreateRuleResult
    > = {
        loadQuery: useQuery<FetchAvailableGlobalTriggers>(FetchAvailableGlobalTriggersQuery, {
            variables: { tagId: props.contextId },
        }),
        buildInitialStatePreload: () => ({
            name: '',
            globalTriggerId: '',
            comments: '',
            minRepeatInterval: -1,
        }),
        saveQuery: useMutation(CreateRuleQuery),
        mapSaveData: (ruleValues: RuleValues) => ({
            ruleCreateInput: {
                rule_group_id: props.id,
                name: ruleValues.name,
                min_repeat_interval:
                    ruleValues.minRepeatInterval > 0
                        ? ruleValues.minRepeatInterval * 1000
                        : ruleValues.minRepeatInterval,
                ...(ruleValues.globalTriggerId === ''
                    ? {}
                    : { global_trigger_id: ruleValues.globalTriggerId }),
                ...(ruleValues.comments === ''
                    ? {}
                    : {
                          comments: ruleValues.comments,
                      }),
            },
        }),
        buildFormProps: (
            formLoadedData: FetchAvailableGlobalTriggers,
            formValidationValues: FormValidationResult<RuleValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Rule',
            title: 'Create Rule',
            formInfoProps: buildStandardFormInfo('rules', 'Create'),
            handleDialogClose: props.handleDialogClose,
            availableGlobalTriggers: formLoadedData.getTag.revision.global_triggers.map((_) => ({
                key: _.id,
                text: _.name,
            })),
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.createRule.id !== undefined,
        pageComponent: RuleForm,
        validators: [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Rule Group name too short',
            },
        ],
        ...props,
    };

    return (
        <DialogPreloadForm<
            FetchAvailableGlobalTriggers,
            RuleValues,
            RuleFormProps,
            CreateRuleResult
        >
            {...ruleCreateProps}
        />
    );
};

export default RuleCreate;
