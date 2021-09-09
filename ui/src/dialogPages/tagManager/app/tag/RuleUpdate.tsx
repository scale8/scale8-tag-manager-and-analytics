import { FC } from 'react';
import { FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import UpdateRuleGetQuery from '../../../../gql/queries/UpdateRuleGetQuery';
import { UpdateRuleGetData } from '../../../../gql/generated/UpdateRuleGetData';
import UpdateRuleQuery from '../../../../gql/mutations/UpdateRuleQuery';
import RuleForm from '../../../../components/organisms/Forms/RuleForm';
import nameValidator from '../../../../utils/validators/nameValidator';
import { RuleFormProps, RuleValues } from './RuleCreate';
import { UpdateRuleResult } from '../../../../gql/generated/UpdateRuleResult';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';

const RuleUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const ruleUpdateProps: DialogPreloadFormProps<
        UpdateRuleGetData,
        RuleValues,
        RuleFormProps,
        UpdateRuleResult
    > = {
        loadQuery: useQuery<UpdateRuleGetData>(UpdateRuleGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: UpdateRuleGetData) => ({
            name: formLoadedData.getRule.name,
            globalTriggerId: '',
            comments: '',
            minRepeatInterval:
                formLoadedData.getRule.min_repeat_interval > 0
                    ? formLoadedData.getRule.min_repeat_interval / 1000
                    : formLoadedData.getRule.min_repeat_interval,
        }),
        saveQuery: useMutation(UpdateRuleQuery),
        mapSaveData: (formValues: RuleValues) => ({
            ruleUpdateInput: {
                rule_id: props.id,
                name: formValues.name,
                min_repeat_interval:
                    formValues.minRepeatInterval > 0
                        ? formValues.minRepeatInterval * 1000
                        : formValues.minRepeatInterval,
                ...(formValues.comments === ''
                    ? {}
                    : {
                          comments: formValues.comments,
                      }),
            },
        }),
        buildFormProps: (
            formLoadedData: UpdateRuleGetData,
            formValidationValues: FormValidationResult<RuleValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Update Rule',
            title: 'Update Rule',
            formInfoProps: buildStandardFormInfo('rules', 'Update'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateRule,
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
        <DialogPreloadForm<UpdateRuleGetData, RuleValues, RuleFormProps, UpdateRuleResult>
            {...ruleUpdateProps}
        />
    );
};

export { RuleUpdate };
