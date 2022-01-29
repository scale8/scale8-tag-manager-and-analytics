import { FC } from 'react';
import { DialogPageProps } from '../../../types/DialogTypes';
import {
    DialogDirectMutation,
    DialogMutationFunction,
} from '../../abstractions/DialogDirectMutation';
import DeleteTemplatedActionQuery from '../../../gql/mutations/DeleteTemplatedActionQuery';

const TemplatedActionDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: {
                        platformActionTemplatedDeleteInput: {
                            platform_action_id: id,
                        },
                    },
                });
            }}
            mutation={DeleteTemplatedActionQuery}
            {...props}
        />
    );
};

export default TemplatedActionDelete;
