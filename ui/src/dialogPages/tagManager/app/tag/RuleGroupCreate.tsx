import { FC } from 'react';
import RuleGroupForm from '../../../../components/organisms/Forms/RuleGroupForm';
import { FormProps, FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation } from '@apollo/client';
import CreateRuleGroupQuery from '../../../../gql/mutations/CreateRuleGroupQuery';
import nameValidator from '../../../../utils/validators/nameValidator';
import { CreateRuleGroup } from '../../../../gql/generated/CreateRuleGroup';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { DialogForm, DialogFormProps } from '../../../abstractions/DialogForm';

export type RuleGroupValues = {
    name: string;
    comments: string;
};

export type RuleGroupFormProps = FormProps<RuleGroupValues>;

const RuleGroupCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const tagId = props.contextId;

    const ruleGroupCreateProps: DialogFormProps<
        RuleGroupValues,
        RuleGroupFormProps,
        CreateRuleGroup
    > = {
        buildInitialState: () => ({
            name: '',
            comments: '',
        }),
        saveQuery: useMutation(CreateRuleGroupQuery),
        mapSaveData: (ruleGroupValues: RuleGroupValues) => ({
            ruleGroupCreateInput: {
                tag_id: tagId,
                name: ruleGroupValues.name,
                ...(ruleGroupValues.comments === ''
                    ? {}
                    : {
                          comments: ruleGroupValues.comments,
                      }),
            },
        }),
        buildFormProps: (
            formValidationValues: FormValidationResult<RuleGroupValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Rule Group',
            title: 'Create Rule Group',
            formInfoProps: buildStandardFormInfo('ruleGroups', 'Create'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.createRuleGroup.id !== undefined,
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
        <DialogForm<RuleGroupValues, RuleGroupFormProps, CreateRuleGroup>
            {...ruleGroupCreateProps}
        />
    );
};

export default RuleGroupCreate;
