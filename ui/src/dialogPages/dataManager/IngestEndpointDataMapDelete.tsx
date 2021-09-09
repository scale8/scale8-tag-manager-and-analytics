import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import DeleteIngestEndpointDataMapQuery from '../../gql/mutations/DeleteIngestEndpointDataMapQuery';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';

const IngestEndpointDataMapDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: {
                        deleteChildIngestEndpointDataMapInput: {
                            ingest_endpoint_data_map_id: id,
                        },
                    },
                });
            }}
            mutation={DeleteIngestEndpointDataMapQuery}
            {...props}
        />
    );
};

export { IngestEndpointDataMapDelete };
