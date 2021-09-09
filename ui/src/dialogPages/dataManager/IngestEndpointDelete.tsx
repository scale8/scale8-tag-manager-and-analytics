import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import DeleteIngestEndpointQuery from '../../gql/mutations/DeleteIngestEndpointQuery';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';

const IngestEndpointDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: {
                        ingestEndpointDeleteInput: {
                            ingest_endpoint_id: id,
                        },
                    },
                });
            }}
            mutation={DeleteIngestEndpointQuery}
            {...props}
        />
    );
};

export { IngestEndpointDelete };
