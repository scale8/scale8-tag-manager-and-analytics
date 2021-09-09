import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogMutationFunction } from '../../../abstractions/DialogDirectMutation';
import DeleteActionQuery from '../../../../gql/mutations/DeleteActionQuery';
import { DialogDeleteComment } from '../../../abstractions/DialogDeleteComment';

const ActionDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDeleteComment
            text={`Delete Action ${props.name}?`}
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
                contextId: string,
                ids: string[],
                comments: string,
            ) => {
                await mutationFunction({
                    variables: {
                        actionDeleteInput: {
                            action_id: id,
                            ...(comments === '' ? {} : { comments }),
                        },
                    },
                });
            }}
            mutation={DeleteActionQuery}
            {...props}
        />
    );
};

export { ActionDelete };
