import { FC } from 'react';
import { FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import UpdateRuleGroupGetQuery from '../../../../gql/queries/UpdateRuleGroupGetQuery';
import { UpdateRuleGroupGetData } from '../../../../gql/generated/UpdateRuleGroupGetData';
import UpdateRuleGroupQuery from '../../../../gql/mutations/UpdateRuleGroupQuery';
import RuleGroupForm from '../../../../components/organisms/Forms/RuleGroupForm';
import nameValidator from '../../../../utils/validators/nameValidator';
import { RuleGroupFormProps, RuleGroupValues } from './RuleGroupCreate';
import { UpdateRuleGroup } from '../../../../gql/generated/UpdateRuleGroup';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';

const RuleGroupUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const ruleGroupUpdateProps: DialogPreloadFormProps<
        UpdateRuleGroupGetData,
        RuleGroupValues,
        RuleGroupFormProps,
        UpdateRuleGroup
    > = {
        loadQuery: useQuery<UpdateRuleGroupGetData>(UpdateRuleGroupGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: UpdateRuleGroupGetData) => ({
            name: formLoadedData.getRuleGroup.name,
            comments: '',
        }),
        saveQuery: useMutation(UpdateRuleGroupQuery),
        mapSaveData: (ruleGroupValues: RuleGroupValues) => ({
            ruleGroupUpdateInput: {
                rule_group_id: props.id,
                name: ruleGroupValues.name,
                ...(ruleGroupValues.comments === ''
                    ? {}
                    : {
                          comments: ruleGroupValues.comments,
                      }),
            },
        }),
        buildFormProps: (
            formLoadedData: UpdateRuleGroupGetData,
            formValidationValues: FormValidationResult<RuleGroupValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Update Rule Group',
            title: 'Update Rule Group',
            formInfoProps: buildStandardFormInfo('ruleGroups', 'Update'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateRuleGroup,
        pageComponent: RuleGroupForm,
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
            UpdateRuleGroupGetData,
            RuleGroupValues,
            RuleGroupFormProps,
            UpdateRuleGroup
        >
            {...ruleGroupUpdateProps}
        />
    );
};

export default RuleGroupUpdate;
