import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import {
    DialogDirectMutation,
    DialogMutationFunction,
} from '../../../abstractions/DialogDirectMutation';
import ReorderActionsQuery from '../../../../gql/mutations/ReorderActionsQuery';

const ActionOrderUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
                contextId: string,
                ids: string[],
            ) => {
                await mutationFunction({
                    variables: {
                        actionGroupOrderInput: {
                            action_group_id: id,
                            new_order: ids,
                        },
                    },
                });
            }}
            mutation={ReorderActionsQuery}
            {...props}
        />
    );
};

export default ActionOrderUpdate;
