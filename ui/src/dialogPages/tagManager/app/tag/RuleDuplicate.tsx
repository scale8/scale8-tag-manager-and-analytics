import { FC } from 'react';
import { FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import DuplicateRuleQuery from '../../../../gql/mutations/DuplicateRuleQuery';
import DuplicateDialogForm, {
    DuplicateDialogProps,
} from '../../../../components/organisms/Forms/DuplicateDialogForm';
import DuplicateRuleGetQuery from '../../../../gql/queries/DuplicateRuleGetQuery';
import { DuplicateRuleGetData } from '../../../../gql/generated/DuplicateRuleGetData';
import { DuplicateRule } from '../../../../gql/generated/DuplicateRule';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import {
    DuplicateValidators,
    DuplicateValues,
} from '../../../../utils/forms/DuplicateDialogFormUtils';

const RuleDuplicate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const duplicateProps: DialogPreloadFormProps<
        DuplicateRuleGetData,
        DuplicateValues,
        DuplicateDialogProps,
        DuplicateRule
    > = {
        loadQuery: useQuery<DuplicateRuleGetData>(DuplicateRuleGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: DuplicateRuleGetData) => ({
            name: `${formLoadedData.getRule.name} Copy`,
        }),
        saveQuery: useMutation<DuplicateRule>(DuplicateRuleQuery),
        mapSaveData: (formValues: DuplicateValues) => ({
            ruleDuplicateInput: {
                name: formValues.name,
                rule_id: props.id,
            },
        }),
        buildFormProps: (
            formLoadedData: DuplicateRuleGetData,
            formValidationValues: FormValidationResult<DuplicateValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Rule',
            title: 'Create Rule',
            handleDialogClose: props.handleDialogClose,
            oldName: formLoadedData.getRule.name,
            description: `Create a new Rule from ${formLoadedData.getRule.name}?`,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.duplicateRule.id !== undefined,
        pageComponent: DuplicateDialogForm,
        validators: DuplicateValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<
            DuplicateRuleGetData,
            DuplicateValues,
            DuplicateDialogProps,
            DuplicateRule
        >
            {...duplicateProps}
        />
    );
};

export { RuleDuplicate };
