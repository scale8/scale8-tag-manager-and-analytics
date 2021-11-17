import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import {
    DialogDirectMutation,
    DialogMutationFunction,
} from '../../../abstractions/DialogDirectMutation';
import { RuleGroupRuleOrderInput } from '../../../../gql/generated/globalTypes';
import ReorderRulesQuery from '../../../../gql/mutations/ReorderRulesQuery';

const RuleOrderUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
                contextId: string,
                ids: string[],
            ) => {
                const ruleGroupRuleOrderInput: RuleGroupRuleOrderInput = {
                    rule_group_id: id,
                    new_order: ids,
                };
                await mutationFunction({
                    variables: { ruleGroupRuleOrderInput },
                });
            }}
            mutation={ReorderRulesQuery}
            {...props}
        />
    );
};

export default RuleOrderUpdate;
