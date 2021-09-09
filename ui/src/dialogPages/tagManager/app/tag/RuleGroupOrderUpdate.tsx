import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import {
    DialogDirectMutation,
    DialogMutationFunction,
} from '../../../abstractions/DialogDirectMutation';
import { TagRuleGroupOrderInput } from '../../../../gql/generated/globalTypes';
import ReorderRuleGroupsQuery from '../../../../gql/mutations/ReorderRuleGroupsQuery';

const RuleGroupOrderUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
                contextId: string,
                ids: string[],
            ) => {
                const tagRuleGroupOrderInput: TagRuleGroupOrderInput = {
                    tag_id: id,
                    new_order: ids,
                };
                await mutationFunction({
                    variables: { tagRuleGroupOrderInput },
                });
            }}
            mutation={ReorderRuleGroupsQuery}
            {...props}
        />
    );
};

export { RuleGroupOrderUpdate };
