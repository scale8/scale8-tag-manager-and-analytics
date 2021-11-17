import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import {
    DialogDirectMutation,
    DialogMutationFunction,
} from '../../../abstractions/DialogDirectMutation';
import ReorderActionGroupsQuery from '../../../../gql/mutations/ReorderActionGroupsQuery';
import { ActionGroupDistributionOrderInput } from '../../../../gql/generated/globalTypes';

const ActionGroupOrderUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
                contextId: string,
                ids: string[],
            ) => {
                const actionGroupDistributionOrderInput: ActionGroupDistributionOrderInput = {
                    action_group_distribution_id: id,
                    new_order: ids,
                };
                await mutationFunction({
                    variables: { actionGroupDistributionOrderInput },
                });
            }}
            mutation={ReorderActionGroupsQuery}
            {...props}
        />
    );
};

export default ActionGroupOrderUpdate;
