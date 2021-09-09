import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogMutationFunction } from '../../../abstractions/DialogDirectMutation';
import DeleteConditionRuleQuery from '../../../../gql/mutations/DeleteConditionRuleQuery';
import { DialogDeleteComment } from '../../../abstractions/DialogDeleteComment';

const ConditionDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDeleteComment
            text={`Delete Condition ${props.name}?`}
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
                contextId: string,
                ids: string[],
                comments: string,
            ) => {
                await mutationFunction({
                    variables: {
                        conditionRuleDeleteInput: {
                            condition_rule_id: id,
                            ...(comments === '' ? {} : { comments }),
                        },
                    },
                });
            }}
            mutation={DeleteConditionRuleQuery}
            {...props}
        />
    );
};

export { ConditionDelete };
