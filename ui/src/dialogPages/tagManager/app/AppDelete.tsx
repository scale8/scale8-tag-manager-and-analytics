import { FC } from 'react';
import { DialogPageProps } from '../../../types/DialogTypes';
import {
    DialogDirectMutation,
    DialogMutationFunction,
} from '../../abstractions/DialogDirectMutation';
import DeleteAppQuery from '../../../gql/mutations/DeleteAppQuery';

const AppDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: { appDeleteInput: { app_id: id } },
                });
            }}
            mutation={DeleteAppQuery}
            {...props}
        />
    );
};

export { AppDelete };
