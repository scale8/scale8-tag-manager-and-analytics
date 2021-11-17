import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogMutationFunction } from '../../../abstractions/DialogDirectMutation';
import DeleteEventQuery from '../../../../gql/mutations/DeleteEventQuery';
import { DialogDeleteComment } from '../../../abstractions/DialogDeleteComment';

const EventDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDeleteComment
            text={`Delete Event ${props.name}?`}
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
                contextId: string,
                ids: string[],
                comments: string,
            ) => {
                await mutationFunction({
                    variables: {
                        eventDeleteInput: {
                            event_id: id,
                            ...(comments === '' ? {} : { comments }),
                        },
                    },
                });
            }}
            mutation={DeleteEventQuery}
            {...props}
        />
    );
};

export default EventDelete;
