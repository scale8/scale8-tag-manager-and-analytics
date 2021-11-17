import { FC } from 'react';
import DeleteEnvironmentQuery from '../../../gql/mutations/DeleteEnvironmentQuery';
import { DialogPageProps } from '../../../types/DialogTypes';
import {
    DialogDirectMutation,
    DialogMutationFunction,
} from '../../abstractions/DialogDirectMutation';

const EnvironmentDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: {
                        environmentDeleteInput: {
                            environment_id: id,
                        },
                    },
                });
            }}
            mutation={DeleteEnvironmentQuery}
            {...props}
        />
    );
};

export default EnvironmentDelete;
