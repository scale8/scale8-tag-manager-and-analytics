import { FC } from 'react';
import { FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import DuplicateRuleGroupQuery from '../../../../gql/mutations/DuplicateRuleGroupQuery';
import DuplicateDialogForm, {
    DuplicateDialogProps,
} from '../../../../components/organisms/Forms/DuplicateDialogForm';
import DuplicateRuleGroupGetQuery from '../../../../gql/queries/DuplicateRuleGroupGetQuery';
import { DuplicateRuleGroupGetData } from '../../../../gql/generated/DuplicateRuleGroupGetData';
import { DuplicateRuleGroup } from '../../../../gql/generated/DuplicateRuleGroup';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import {
    DuplicateValidators,
    DuplicateValues,
} from '../../../../utils/forms/DuplicateDialogFormUtils';
import { generateRevisionName } from '../../../../../../common/utils/GenerateRevisionName';

const RuleGroupDuplicate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const duplicateProps: DialogPreloadFormProps<
        DuplicateRuleGroupGetData,
        DuplicateValues,
        DuplicateDialogProps,
        DuplicateRuleGroup
    > = {
        loadQuery: useQuery<DuplicateRuleGroupGetData>(DuplicateRuleGroupGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: () => ({
            name: generateRevisionName(),
        }),
        saveQuery: useMutation<DuplicateRuleGroup>(DuplicateRuleGroupQuery),
        mapSaveData: (formValues: DuplicateValues) => ({
            ruleGroupDuplicateInput: {
                name: formValues.name,
                rule_group_id: props.id,
            },
        }),
        buildFormProps: (
            formLoadedData: DuplicateRuleGroupGetData,
            formValidationValues: FormValidationResult<DuplicateValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Rule Group',
            title: 'Create Rule Group',
            oldName: formLoadedData.getRuleGroup.name,
            description: `Create a new Rule Group from ${formLoadedData.getRuleGroup.name}?`,
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.duplicateRuleGroup.id !== undefined,
        pageComponent: DuplicateDialogForm,
        validators: DuplicateValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<
            DuplicateRuleGroupGetData,
            DuplicateValues,
            DuplicateDialogProps,
            DuplicateRuleGroup
        >
            {...duplicateProps}
        />
    );
};

export default RuleGroupDuplicate;
