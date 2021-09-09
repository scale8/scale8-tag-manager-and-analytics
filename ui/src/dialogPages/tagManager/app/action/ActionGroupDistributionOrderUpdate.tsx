import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import {
    DialogDirectMutation,
    DialogMutationFunction,
} from '../../../abstractions/DialogDirectMutation';
import { RuleOrderInput } from '../../../../gql/generated/globalTypes';
import ReorderActionGroupDistributionsQuery from '../../../../gql/mutations/ReorderActionGroupDistributionsQuery';

const ActionGroupDistributionOrderUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
                contextId: string,
                ids: string[],
            ) => {
                const ruleOrderInput: RuleOrderInput = {
                    rule_id: id,
                    new_order: ids,
                };
                await mutationFunction({
                    variables: { ruleOrderInput },
                });
            }}
            mutation={ReorderActionGroupDistributionsQuery}
            {...props}
        />
    );
};

export { ActionGroupDistributionOrderUpdate };
